import {NextFunction, Request, Response} from 'express';
import {check, sanitize, validationResult} from 'express-validator';
import * as passport from 'passport';
import {IVerifyOptions} from 'passport-local';
import '../config/server/passport';
import {UserInterface} from '../database/models/User';
import {AuthService, SequelizeUserRepository} from '../services/authService';
import logger from '../utils/logger';

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('postRegister: Received signup request');
  logger.info('postRegister: Validating request body');
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password must be at least 4 characters long')
    .isLength({min: 4})
    .run(req);
  await check('confirmPassword', 'Passwords do not match')
    .equals(req.body.password)
    .run(req);
  await check('firstName', 'First name is not valid')
    .exists()
    .isAlpha()
    .run(req);
  await check('lastName', 'Last name is not valid').exists().isAlpha().run(req);
  await sanitize('email').normalizeEmail({gmail_remove_dots: false}).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(
      'postRegister: Request body validation failed. Will redirect to /register path.',
      errors
    );
    req.flash(
      'errors',
      errors.array().map(error => error.msg)
    );
    return res.redirect('/register');
  }
  logger.info('postRegister: Request body validation passed.');
  const user: Omit<UserInterface, 'id'> = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const authService = new AuthService(new SequelizeUserRepository());
  authService
    .registerUser(user, req.body.password)
    .then((user: UserInterface) => {
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    })
    .catch(err => {
      return next(err);
    });
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('postLogin: Received login request');
  logger.info('postLogin: Validating request body');
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password is not valid').notEmpty().run(req);
  await sanitize('email').normalizeEmail({gmail_remove_dots: false}).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(
      'postLogin: Request body validation failed. Will redirect to /login path.'
    );
    req.flash(
      'errors',
      errors.array().map(error => error.msg)
    );
    return res.redirect('/login');
  }
  logger.info('postLogin: Request body validation passed.');
  passport.authenticate(
    'login-local',
    (err: Error, user: UserInterface, info: IVerifyOptions) => {
      console.log(user);
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', info.message);
        return res.redirect('/login');
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'Success! You are logged in.');
        res.redirect(req.session.returnTo || '/');
      });
    }
  )(req, res, next);
};

/**
 * Login page.
 * @route GET /login
 */
export const getLogin = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.send('login');
};
