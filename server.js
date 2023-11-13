const express = require('express');
const next = require('next');
const path = require('path');
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

    fs.readdirSync("./api").forEach(function(file) {
      file = "./api/" + file;
      if(fs.lstatSync(file).isFile()) {
        const path = require(file);
        if(path.route) {
          const method = path.method.toLowerCase();
          const handler = (callback) => {
            if(method == "get") server.get(path.route, callback);
            else if(method == "post") server.post(path.route, callback);
          };

          handler(async (req, res) => {
            if(path.authenticate) {
              const user = await authenticate.login(req.cookies.user, req.cookies.session);
              if(user) {
                return path.api(req, res, user);
              } else {
                res.status(403);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({error: "forbidden"}));
              }
            } else return path.api(req, res);
          });
        }
      }
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
