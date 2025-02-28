import express from 'express';
import { AuthRoute } from './auth.route';

export class BaseRoute {
    public router: express.Router;
    private authRoute: AuthRoute;

    constructor() {
        this.router = express.Router();
        this.authRoute = new AuthRoute();
        this.load();
    }

    private load() {
        this.router.use('/auth', this.authRoute.getRouter());
    }
}