import {Application} from 'express';
import * as passport from 'passport';
import * as userAuthRoutes from './routeHandlers/AuthRoutesHandlers';

const express = require('express');

const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
declare module 'express-session' {
  interface Session {
    returnTo: string;
  }
}

export class ExpressServerInitializer {
  public static startExpressServer() {
    const app: Application = express();
    app.use(express.static('public'));
    app.use(session({secret: 'cats', resave: true, saveUninitialized: true}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use((req, res, next) => {
      // After successful login, redirect back to the intended page
      if (
        !req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)
      ) {
        req.session.returnTo = req.path;
      } else if (req.user && req.path === '/account') {
        req.session.returnTo = req.path;
      }
      next();
    });

    this.setupExpressServerRoutes(app);
    const port = 3000;
    app.listen(port, () => {
      console.log(`🚀  Server ready at ${port}`);
    });
  }

  private static setupExpressServerRoutes(server: Application): void {
    server.post('/signup', userAuthRoutes.postRegister);
    server.post('/login', userAuthRoutes.postLogin);
    server.get('/login', userAuthRoutes.getLogin);
    server.get('/', (req, res) => {
      res.send('Hello');
    });
  }
}
