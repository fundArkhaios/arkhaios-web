require('dotenv').config()

const cors = require('cors');
const https = require('https');
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

        let forbidden = false;
        let userValid = user ? true : false;

        if(path.kyc) { // Does the user need to be KYC verified?
          if(!(user?.brokerageID)) forbidden = true;
        } else if(userValid == path.authenticate) {
          if(path.authenticate) {
            if(!path.unverified && !user.emailVerified) {
              forbidden = true;
            }
          }
        } else if(userValid) forbidden = true;

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
          console.log(req);
          console.log(req.cookies.email);
          console.log(req.cookies.password);
          const [forbidden, user] = await getUser(req);

          if(user) {
            return path.websocket(ws, req, user);
          } else return path.websocket(ws, req);
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
    console.log('Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('Subdomains:', req.subdomains)
    const host = req.headers.host;
    const hostParts = host.split('.');
    req.subdomains = hostParts.slice(0, -2); // Adjust depending on your TLD length
    console.log('Subdomains:', req.subdomains)
    nextApp();
  });


  route(server);

  // Custom route for the subdomain 'funds'
  server.get('/', (req, res) => {
    console.log("Wow: " + req.subdomains);
    if (req.subdomains.includes('funds')) {
      return nextApp.render(req, res, '/funds-home', req.query);
    } else {
      // Render the root domain homepage
      return nextApp.render(req, res, '/root-home', req.query);
    }
  });

  server.get('*', async (req, res) => {
    const parsed = url.parse(req.url, true);
    await nextHandler(req, res);
  });

  

  // Check for the existence of the SSL certificate files
  const keyPath = './certs/local.test.key';
  const certPath = './certs/local.test.crt';

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, server).listen(port, (err) => {
      if (err) throw err;

      if (dev) {
        console.log(`Listening on https://localhost:${port}`);
        
        logger.add(new winston.transports.Console({
          format: winston.format.simple()
        }));
      }
    });
  } else {
    // Fall back to HTTP if SSL certificate files are not found
    server.listen(port, (err) => {
      if (err) throw err;

      if (dev) {
        console.log(`Listening on http://localhost:${port}`);
        
        logger.add(new winston.transports.Console({
          format: winston.format.simple()
        }));
      }
    });
  }
});
