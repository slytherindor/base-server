import User, {UserInterface} from "../database/models/User";

abstract class AbstractUserRepository {
    abstract findUser(identifier: string): Promise<UserInterface|null>
}

export class SequelizeUserRepository implements AbstractUserRepository {
    findUser(identifier: string): Promise<UserInterface|null> {
        return User.findOne({where: {email: identifier}});
    }
}
export class AuthService {
    public async verifyFunc(username: string, password: string, done: Function): Promise<void> {
        try {
            let user = await new SequelizeUserRepository().findUser(username);
            if (!user) {
                done(null, false, {message: "Incorrect username"});
                return;
            }
            //TODO: Check for password validity here
            if (user.firstName! !== "Ryan") {
                done(null, false, {message: "Incorrect password"});
                return;
            }
            done(null, user);
            return;
        } catch (e) {
            return done(e);
        }

    }

}
