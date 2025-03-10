import express from 'express';
import { AuthRoute } from './auth.route';
import {HomeRoute} from "./home.route";

export class BaseRoute {
    public router: express.Router;
    private authRoute: AuthRoute;
    private homeRoute: HomeRoute;

    constructor() {
        this.router = express.Router();
        this.authRoute = new AuthRoute();
        this.homeRoute = new HomeRoute();
        this.load();
    }

    private load() {
        this.router.use('/', this.homeRoute.getRouter());
        this.router.use('/auth', this.authRoute.getRouter());
    }
}