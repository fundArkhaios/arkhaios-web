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

nextApp.prepare()
  .then(async () => {
    const server = express();

    server.use(cookieParser());
    server.use(express.json());

    // Listen for an endpoint defined in a file
    const addEndpoint = function(file) {
      const path = require(file);

      // Verify a route is defined
      if(path.route) {
        const handler = (callback) => {
          return async function(req, res) {
            if(path.authenticate) {
              // API requires authentication
              const user = await authenticate.login(req.cookies.username,
                                                    req.cookies.session);
              if(user) callback(req, res, user);
              else {
                // Authentication failed, return error response
                res.status(403);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({error: "forbidden"}));
              }
            } else callback(req, res);
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
