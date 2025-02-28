import express from 'express';

export class AuthRoute {
    private router;

    constructor() {
        this.router = express.Router();
        this.router.get('/login', this.login.bind(this));
    }

    async login(request: express.Request, response: express.Response) {
        response.json({ message: "This is a login get call" });
    }

    getRouter() {
        return this.router;
    }
}