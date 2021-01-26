import {ApolloServer, gql} from 'apollo-server-express';
import {Application} from 'express';
import * as fs from 'fs';
import * as passport from 'passport';
import * as path from 'path';
import {clientBuildDir} from './config/server/client';
import {GithubAPI} from './graphql/datasources/githubAPI';
import {PortfolioEndpoint} from './graphql/endpoints/portfolioEndpoint';
import logger from './utils/logger';

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
    logger.info('ExpressServerInitializer: Configuring server');
    this.app = express();
    this.app.use(express.static('public'));
    this.app.use(
      session({secret: 'cats', resave: true, saveUninitialized: true})
    );
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
    logger.info('ExpressServerInitializer: Setting up routes on server');
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(clientBuildDir, 'index.html'));
    });
  }

  public static start(port: number) {
    this.app = express();
    this.app.use(express.static(clientBuildDir));
    // this.configExpressServer();
    this.setupExpressServerRoutes();
    this.configGraphqlServer();
    this.app.listen(port, () => {
      logger.info(`ExpressServerInitializer: 🚀 Server ready at ${port}`);
    });
  }

  private static resolvers: any;
  private static typeDefs: any;

  public static configGraphqlServer() {
    this.loadGraphqlSchema();
    this.initResolvers();
    const gqlServer = new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      dataSources: () => {
        return {
          githubAPI: new GithubAPI(),
        };
      },
      context: ({req}) => ({req: req}),
    });
    const app = this.app;
    gqlServer.applyMiddleware({app});
  }

  private static loadGraphqlSchema(): void {
    logger.info('ExpressServerInitializer: Loading graphql schema');
    try {
      this.typeDefs = gql(
        fs.readFileSync(__dirname.concat('/graphql/schema.graphql'), 'utf8')
      );
    } catch (e) {
      logger.error('ExpressServerInitializer: Failed to load graphql schema');
      throw e;
    }
  }

  private static initResolvers() {
    logger.info('ExpressServerInitializer: Initializing graphql resolvers');
    const portfolioEndpoint = new PortfolioEndpoint();
    this.resolvers = [portfolioEndpoint.initialize()];
  }
}
