import {DatabaseClient} from '../database/client';
import User, {UserInterface} from '../database/models/User';
import UserCredential from '../database/models/UserCredential';

abstract class AbstractUserRepository {
  abstract findUserWithCredential(
    identifier: string
  ): Promise<UserInterface | null>;
  abstract createUser(
    user: Omit<UserInterface, 'id'>,
    credential: string
  ): Promise<UserInterface>;
  abstract findById(id: string): Promise<UserInterface>;
}

export class SequelizeUserRepository implements AbstractUserRepository {
  findUserWithCredential(identifier: string): Promise<User | null> {
    return User.findOne({
      where: {email: identifier},
      include: User.associations.userCredential,
    });
  }

  findUser(identifier: string): Promise<User | null> {
    return User.findOne({where: {email: identifier}});
  }

  findById(id: string): Promise<UserInterface> {
    return User.findByPk(id, {rejectOnEmpty: true});
  }

  createUser(
    user: Omit<UserInterface, 'id'>,
    credential: string
  ): Promise<UserInterface> {
    try {
      const sequelize = DatabaseClient.defaultClient();
      return sequelize.transaction(async t => {
        const createdUser: User = await User.create(user, {transaction: t});
        await UserCredential.create(
          {userId: createdUser.id, credential: credential},
          {transaction: t}
        );
        return createdUser as UserInterface;
      });
    } catch (e) {
      console.error(e);
      throw new Error('Unable to create user.');
    }
  }
}

class AuthServiceError extends Error {}
export class AuthService {
  public static async verifyLoginFunc(
    username: string,
    password: string,
    done: Function
  ): Promise<void> {
    try {
      const user = await new SequelizeUserRepository().findUserWithCredential(
        username
      );
      if (!user) {
        done(null, false, {message: 'Incorrect username'});
        return;
      }
      if (await user.userCredential!.validPassword(password)) {
        done(null, false, {message: 'Incorrect password'});
        return;
      }
      done(null, user);
      return;
    } catch (e) {
      return done(e);
    }
  }

  async registerUser(
    user: Omit<UserInterface, 'id'>,
    credential: string
  ): Promise<UserInterface> {
    try {
      return await new SequelizeUserRepository().createUser(user, credential);
    } catch (e) {
      console.error(e);
      throw new AuthServiceError('Failed to register user.');
    }
  }
}
