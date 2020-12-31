import {NextFunction, Request, Response} from 'express';
import passport from 'passport';
import passportLocal, {Strategy} from 'passport-local';
import {UserInterface} from '../../database/models/User';
import {AuthService, SequelizeUserRepository} from '../../services/authService';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user: any, done) => {
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

passport.use('login-local', new LocalStrategy(AuthService.verifyLoginFunc));
passport.use(
  'register-local',
  new Strategy({usernameField: 'email'}, AuthService.verifyRegisterFunc)
);

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
