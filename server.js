const express = require('express');
const next = require('next');
const url = require('url');

const authenticate = require('./util/authenticate');

const fs = require("fs");

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const nextApp = next({ dir: '.', dev });
const nextHandler = nextApp.getRequestHandler();

const cookieParser = require('cookie-parser');

function route(server) {
  // Listen for an endpoint defined in a file
  const addEndpoint = function(file) {
    const path = require(file);

    // Verify a route is defined
    if(path.route) {
      const handler = (callback) => {
        return async function(req, res) {
          try {
            // API may require authentication

            // console.log(req.cookies.email, req.cookies.session);

            const user = await authenticate.login(req.cookies.email,
                                                  req.cookies.session);



            
            let forbidden = false;
            let userValid = user ? true : false;
            
            
            
            

            if(path.kyc) { // Does the user need to be KYC verified?
              if(user?.brokerageID) callback(req, res, user);
              else forbidden = true;
            } else if(userValid == path.authenticate) {
              if(path.authenticate) {
                if(path.unverified || user.emailVerified) {
                  callback(req, res, user);
                } else forbidden = true;
              } else callback(req, res);
            } else forbidden = true;

            if(forbidden) {
              // Authentication failed, return error response
              res.setHeader('Content-Type', 'application/json');
              res.status(403);
              res.send(JSON.stringify({error: "forbidden"}));
            }
          } catch(e) {
            res.status(501);
            res.send(JSON.stringify({error: "server error"}));
          }
        };
      };

      if(path.get) server.get(path.route, handler(path.get));
      if(path.post) server.post(path.route, handler(path.post));
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
    const server = express();

    server.use(cookieParser());
    server.use(express.json());

    route(server);

    server.get('*', async (req, res) => {
      const parsed = url.parse(req.url, true);
      await nextHandler(req, res, parsed);
    });

    server.listen(port, (err) => {
      if (err) throw err;

      if(process.env.NODE_ENV !== 'production') {
        console.log(`Listening on http://localhost:${port}`);
      }
    });
  });
