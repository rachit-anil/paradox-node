import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { BaseRoute } from './routes';
import cookieParser from 'cookie-parser';
import path from "node:path";
import bodyParser from 'body-parser';
import {csrfMiddleware} from "./custom-middleware/csrf";
import {authenticateUser} from "./custom-middleware/authMiddleware";

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// Use cookie-parser middleware
app.use(cookieParser());
// Custom CORS middleware
const allowedOrigins = ["http://localhost:4200", "https://projectparadox.in"];
app.use(
    cors({
        origin: allowedOrigins, // Allow only this origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow only these HTTP methods
        allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"], // Allow only these headers
        credentials: true, // Allow cookies and credentials to be sent
    })
);

// Use custom csrf middleware
if(process.env.NODE_ENV === 'production') {
    app.use(csrfMiddleware);
}

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'ui', 'dist', 'browser')));


const route = new BaseRoute();
app.use('/', authenticateUser, route.router);

const port = process.env.PORT || 8080;

// On docker also we are running it on 8080
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
