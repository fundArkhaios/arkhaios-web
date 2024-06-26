require('dotenv').config()

const cors = require('cors');
const https = require('https');
const http = require('http');
const WebSocket = require('ws')
const express = require('express');
const next = require('next');
const url = require('url');

const { logger } = require('./util/logger')

const authenticate = require('./util/authenticate');

const fs = require("fs");

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const nextApp = next({ dir: '.', dev });
const nextHandler = nextApp.getRequestHandler();

const cookieParser = require('cookie-parser');
const { redis } = require('./util/db');
const winston = require('winston');

function route(server) {
  // Listen for an endpoint defined in a file
  const addEndpoint = function(file) {
    const path = require(file);

    // Verify a route is defined
    if(path.route) {
      const getUser = async (req) => {
        // API may require authentication
        const user = await authenticate.login(req.cookies.email,
                                              req.cookies.session);

        let forbidden = true;
        let userValid = user ? true : false;

        if(path.kyc) { // Does the user need to be KYC verified?
          if(user?.brokerageID) forbidden = false;
        } else if(userValid == path.authenticate) {
          if(path.authenticate) {
            if(path.unverified || user.emailVerified) {
              forbidden = false;
            }
          } else forbidden = false;
        }

        return [forbidden, user];
      }

      const handler = (callback) => {
        return async function(req, res) {
          try {
            const [forbidden, user] = await getUser(req);

            if(forbidden) {
              // Authentication failed, return error response
              res.setHeader('Content-Type', 'application/json');
              res.status(403);
              res.send(JSON.stringify({error: "forbidden"}));
            } else {
              if(user) {
                callback(req, res, user);
              } else {
                callback(req, res);
              }
            }
          } catch(e) {
            logger.log({
              level: 'error',
              message: e
            })
            
            res.status(501);
            res.send(JSON.stringify({error: "server error"}));
          }
        };
      };

      if(path.get) server.get(path.route, handler(path.get));
      if(path.post) server.post(path.route, handler(path.post));

      if(path.websocket) {
        server.ws(path.route, async function(ws, req) {
          const [forbidden, user] = await getUser(req);

          try {
            if(user) {
              return path.websocket(ws, req, user);
            } else return path.websocket(ws, req);
          } catch(e) {
            console.log(e);
          }
        });
      }
    }
  }

  // Add endpoints or recursively walk directory
  const walkDirectory = function(file) {
    const stat = fs.lstatSync(file);

    if(stat.isFile()) addEndpoint(file);
    else if(stat.isDirectory()) {
      const dir = file;
      fs.readdirSync(dir).forEach((file) => { 
        walkDirectory(dir + "/" + file);
      });
    }
  }

  // Walk through the API directory, adding endpoints as necessary
  fs.readdirSync("./api").forEach(function(file) {
    file = "./api/" + file;
    walkDirectory(file);
  });
}

nextApp.prepare()
.then(async () => {
  // await redis.connect();

  const server = express();

  server.use(cookieParser());
  server.use(express.json());

  /* server.use(cors({
    origin: (origin, callback) => {
      if (!origin || /\.local\.test$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // if your frontend needs to send cookies to the backend
    methods: ['GET', 'HEAD'] // adjust the methods as per your needs
  }));
 */
  // Subdomain parsing middleware
  server.use((req, res, nextApp) => {
    const host = req.headers.host;
    const hostParts = host.split('.');
    req.subdomains = hostParts.slice(0, -2); // Adjust depending on your TLD length
    nextApp();
  });

  // Check for the existence of the SSL certificate files
  const keyPath = './certs/local.test.key';
  const certPath = './certs/local.test.crt';

  let httpServer;

  // Instantiate https server or http server
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    httpServer = https.createServer(credentials, server);
  } else {
    httpServer = http.createServer(server);
  }

  // Create new web socket server
  const wss = new WebSocket.Server({ noServer: true })
  const socketRoutes = {};

  server.ws = function(route, callback) {
    socketRoutes[route] = callback;
  }

  wss.on("connection", async function connection(ws, req) {
    const { pathname } = url.parse(req.url, true);
    const callback = socketRoutes[pathname];

    // Manually parse cookies...
    req.cookies = {};
    req.headers.cookie?.split(';').forEach((cookie) => {
      const keyval = cookie?.split('=');
      req.cookies[keyval.shift().trim()] = decodeURIComponent(keyval.join('='));
    });

    if(callback) callback(ws, req);
  });

  const upgrade = function(req, socket, head) {
    try {
      const { pathname } = url.parse(req.url, true);

      if(pathname !== '/_next/webpack-hmr') {
        if(socketRoutes[pathname]) {
          wss.handleUpgrade(req, socket, head, function done(ws) {
            wss.emit('connection', ws, req);
          });
        }
      } else {
        nextApp.upgradeHandler(req, socket, head);
      }
    } catch(e) {}
  }

  const originalOn = httpServer.on.bind(httpServer);
  httpServer.on = function(event, listener) {
    if(event == 'upgrade') {
      return originalOn(event, upgrade);
    } else {
      return originalOn(event, listener);
    }
  }

  route(server);

  // Custom route for the subdomain 'funds'
  server.get('/', (req, res) => {
    if (req.subdomains.includes('funds')) {
      return nextApp.render(req, res, '/funds-home', req.query);
    } else {
      // Render the root domain homepage
      return nextApp.render(req, res, '/', req.query);
    }
  });

  server.get('*', async (req, res) => {
    const parsed = url.parse(req.url, true);
    await nextHandler(req, res);
  });

  // Fall back to HTTP if SSL certificate files are not found
  httpServer.listen(port, (err) => {
    if (err) throw err;

    if (dev) {
      console.log(`Listening on http://localhost:${port}`);
      
      logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  });
});
