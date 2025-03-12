import express from 'express';
import { AuthRoute } from './auth.route';
import {HomeRoute} from "./home.route";
import {UserDetailsRoute} from "./userDetails.route";

export class BaseRoute {
    public router: express.Router;
    private authRoute: AuthRoute;
    private homeRoute: HomeRoute;
    private userDetailsRoute: UserDetailsRoute;

    constructor() {
        this.router = express.Router();
        this.authRoute = new AuthRoute();
        this.userDetailsRoute = new UserDetailsRoute();
        this.homeRoute = new HomeRoute();
        this.load();
    }

    private load() {
        this.router.use('/', this.homeRoute.getRouter());
        this.router.use('/auth', this.authRoute.getRouter());
        this.router.use('/api/userDetails', this.userDetailsRoute.getRouter());
    }
}