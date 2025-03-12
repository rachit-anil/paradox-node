import express from 'express';
import path from "node:path";
import * as fs from "node:fs";

export class HomeRoute {
    private router;

    constructor() {
        this.router = express.Router();
        this.router.get('/', this.homePage.bind(this));
    }

    homePage(req: express.Request, res: express.Response) {

    }

    getRouter() {
        return this.router;
    }
}