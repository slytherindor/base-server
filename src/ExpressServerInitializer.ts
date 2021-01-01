import {Application} from 'express';
import * as passport from 'passport';
import * as userAuthRoutes from './routeHandlers/AuthRoutesHandlers';
import logger from "./utils/logger";

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
  public static app: Application;
  private static configExpressServer() {
    logger.info("ExpressServerInitializer: Configuring server");
    this.app = express();
    this.app.use(express.static('public'));
    this.app.use(session({secret: 'cats', resave: true, saveUninitialized: true}));
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(flash());
    this.app.use((req, res, next) => {
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
  }

  private static setupExpressServerRoutes(): void {
    logger.info("ExpressServerInitializer: Setting up routes on server");
    this.app.post('/signup', userAuthRoutes.postRegister);
    this.app.post('/login', userAuthRoutes.postLogin);
    this.app.get('/login', userAuthRoutes.getLogin);
    this.app.get('/', (req, res) => {
      res.send('Hello');
    });
  }

  public static start(port: number) {
    this.configExpressServer();
    this.setupExpressServerRoutes();
    this.app.listen(port, () => {
      logger.info(`ExpressServerInitializer: 🚀 Server ready at ${port}`);
    });
  }
}
