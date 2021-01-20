import {AuthService} from '../../src/services/authService';
import {StorareUserRepository} from '../utils/testRepositories';

it('AuthService registers a user', async () => {
  expect.assertions(3);
  const authService = new AuthService(new StorareUserRepository(0));
  const userToRegister = {
    firstName: 'Ryan',
    lastName: 'Cyrus',
    email: 'ryan.cyrus@live.com',
  };
  const user = await authService.registerUser(userToRegister, 'password');
  expect(user.email).toEqual(userToRegister.email);
  expect(user.firstName).toEqual(userToRegister.firstName);
  expect(user.lastName).toEqual(userToRegister.lastName);
});

/*
TODO: Find a way to test login by modelling StorageUserRepository properly to include credentials.
*/
it.skip('AuthService logs in a user', async () => {
  expect.assertions(3);
  const authService = new AuthService(new StorareUserRepository(0));
  const userToRegister = {
    firstName: 'Ryan',
    lastName: 'Cyrus',
    email: 'ryan.cyrus@live.com',
  };
  const user = await authService.registerUser(userToRegister, 'password');
  await authService.verifyLoginFunc(
    userToRegister.email,
    'password',
    (err: any, data: any, msg: any) => {
      expect(err).toBeNull();
      expect(data).toEqual(userToRegister);
      expect(msg).toBeNull();
    }
  );
});
