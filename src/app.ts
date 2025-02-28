import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { BaseRoute } from './routes/index';

dotenv.config();
const app = express();

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
app.use('/api', route.router);


const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
