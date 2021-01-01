import {NextFunction, Request, Response} from 'express';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {UserInterface} from '../../database/models/User';
import {AuthService, SequelizeUserRepository} from '../../services/authService';

passport.serializeUser((user: any, done) => {
  console.log(user);
  done(undefined, user.id);
});

passport.deserializeUser((id: number | string, done) => {
  const userRepository = new SequelizeUserRepository();
  userRepository
    .findById(id as string)
    .then((user: UserInterface) => {
      done(null, user);
    })
    .catch(e => done(e, undefined));
});

passport.use('login-local', new Strategy(AuthService.verifyLoginFunc));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
