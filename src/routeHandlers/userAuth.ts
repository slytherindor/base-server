import {NextFunction, Request, Response} from 'express';
import {check, sanitize, validationResult} from 'express-validator';
import {UserInterface} from '../database/models/User';
import {AuthService} from '../services/authService';

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    req.flash(
      'errors',
      errors.array().map(error => error.msg)
    );
    return res.redirect('/register');
  }

  const user: Omit<UserInterface, 'id'> = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const authService = new AuthService();
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
