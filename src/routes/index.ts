import express from 'express';
import { AuthRoute } from './auth.route';
import {GoogleOAuthRoute} from "./googleOAuth.route";
import {UserDetailsRoute} from "./userDetails.route";

export class BaseRoute {
    public router: express.Router;
    private authRoute: AuthRoute;
    private googleOAuthRoute: GoogleOAuthRoute;
    private userDetailsRoute: UserDetailsRoute;

    constructor() {
        this.router = express.Router();
        this.authRoute = new AuthRoute();
        this.userDetailsRoute = new UserDetailsRoute();
        this.googleOAuthRoute = new GoogleOAuthRoute();
        this.load();
    }

    private load() {
        this.router.use('/auth', this.authRoute.getRouter());
        this.router.use('/auth/google', this.googleOAuthRoute.getRouter());
        this.router.use('/api/userDetails', this.userDetailsRoute.getRouter());
    }
}