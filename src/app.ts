import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { BaseRoute } from './routes/index';
import path from "node:path";
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());

// Serve static files from the "ui/dist/browser" directory
app.use(express.static(path.join(__dirname, '..', 'ui', 'dist', 'browser')));

// Custom CORS middleware
const allowedOrigins = ["http://localhost:4200", "https://projectparadox.in"];

app.use(
  cors({
    origin: allowedOrigins, // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
    credentials: true, // Allow cookies and credentials to be sent
  })
);

const route = new BaseRoute();

// Serve index.html for all routes (for SPAs like Angular/React)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'ui', 'dist', 'browser', 'index.html'));
});

app.use('/', route.router);

const port = process.env.PORT || 8080;

// On docker also we are running it on 8080
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
