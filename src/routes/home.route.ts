import express from 'express';
import path from "node:path";
import * as fs from "node:fs";

export class HomeRoute {
    private router;

    constructor() {
        this.router = express.Router();
        this.router.get('/', this.homePage.bind(this));
    }

    // Serve index.html with CSRF token for SPAs like Angular/React
    homePage(req: express.Request, res: express.Response) {
        // const csrfToken = req.csrfToken();
        // res.cookie("_csrf", csrfToken);
        //
        // // Read the HTML file
        // const filePath = path.join(__dirname, '../../', 'ui', 'dist', 'browser', 'index.html');
        // // res.status(200).sendFile(filePath);
        //
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) {
        //         return res.status(500).send('Error loading the page');
        //     }
        //
        //     // Embed the CSRF token in the HTML
        //     const htmlWithCsrfToken = data.replace(
        //         '</head>',
        //         `<meta name="csrf-token" content="${csrfToken}"></head>`
        //     );
        //
        //     res.status(200).sendFile(filePath);
        // });
    }

    getRouter() {
        return this.router;
    }
}