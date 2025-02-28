import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Custom CORS middleware
const allowedOrigins = ["http://localhost:4200", "http://projectparadox.in"];
app.use(
  cors({
    origin: allowedOrigins, // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
    credentials: true, // Allow cookies and credentials to be sent
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Allow specific origin
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific methods
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
//   res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
//   next();
// });

const port = process.env.PORT;
const FAKE_DATA = {
  message: "A message from node",
};

app.get("/auth/login", (req, res) => {
  res.send(FAKE_DATA);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
