import "reflect-metadata"; // Add this line at the top
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { BaseRoute } from './routes/index';
import mysql from 'mysql2';

// Create a connection pool
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'rachitanil',
//     password: 'root',
//     database: 'spring',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });
//
// // Get a connection from the pool
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the database!');
//     connection.release(); // Release the connection back to the pool
// });

dotenv.config();
const app = express();
app.use(express.json());

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
app.use('/', route.router);


const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
