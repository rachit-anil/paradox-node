import "reflect-metadata"; // Add this line at the top
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { BaseRoute } from './routes/index';
import https from 'https'; // Import the HTTPS module
import fs from 'fs';
import path from "node:path";

dotenv.config();
const app = express();
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


// let options = {}; // not the recommended approach as the https certs are readable by node application , may nginx is the way to go
// if(process.env.PRODUCTION){
//     // Load SSL/TLS certificates
//     options = {
//         key: fs.readFileSync('/etc/letsencrypt/live/api.projectparadox.in/privkey.pem'), // Private key
//         cert: fs.readFileSync('/etc/letsencrypt/live/api.projectparadox.in/fullchain.pem'), // Full certificate chain
//     };
// }


const route = new BaseRoute();

// Serve index.html for all routes (for SPAs like Angular/React)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'ui', 'dist', 'browser', 'index.html'));
});

app.use('/', route.router);


const port = process.env.PORT || 8080;

// if(!process.env.PRODUCTION){
//
// }else {
//     // Create an HTTPS server
//     // https.createServer(options, app).listen(8080, () => {
//     //     console.log(`HTTPS is running at ${port}`);
//     // });
// }

app.listen(8080, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
