import * as express from 'express';
const session = require("express-session");
const bodyParser = require("body-parser");
import * as passport from "passport";
import {Strategy} from "passport-local";
const flash = require('connect-flash');
import {AuthService, SequelizeUserRepository} from "./services/authService";

export class ExpressServerInitializer {
    private static passport: passport.PassportStatic = passport;
    public static startExpressServer() {
        const expressServer: express.Application = express();
        this.setupPassport();
        expressServer.use(express.static("public"));
        expressServer.use(session({secret: "cats"}));
        expressServer.use(bodyParser.urlencoded({extended: false}));
        expressServer.use(passport.initialize());
        expressServer.use(passport.session());
        expressServer.use(flash());
        this.setupExpressServerRoutes(expressServer);
        const port = 3000;
        expressServer.listen(port, () => {
            console.log(`🚀  Server ready at ${port}`);
        });
    }

    private static setupPassport() {
        let authService: AuthService = new AuthService(new SequelizeUserRepository());
        this.passport.serializeUser(function(user, done) {
            done(null, user);
        });

        this.passport.deserializeUser(function(id, done) {
            done(null, { id: 1, email: "ryan.cyrus@live.com"});
        });
        this.passport.use(new Strategy(authService.verifyFunc));
    }
    private static setupExpressServerRoutes(server: express.Application): void {
        server.post("/login", passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: "Incorrect Username or password",
            successFlash: "Login succeeded"
        }), (req, res) => {
            res.redirect("/");
        });

        server.get('/',
            function(req, res) {
                res.send( { user: req.user });
            });

        server.get('/login',
            function(req, res){
                res.send('login');
            });

    }

}
