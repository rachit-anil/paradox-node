// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User"; // Import your entity

const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const sqlPort = Number(process.env.SQL_PORT);

export const AppDataSource = new DataSource({
    type: "mysql", // or 'postgres', 'sqlite', etc.
    host: dbHost,
    port: sqlPort,
    username: dbUsername,
    password: dbPassword,
    database: "spring",
    synchronize: true, // Automatically create database schema (for development only)
    logging: true, // Enable logging
    entities: [User], // Add your entities here
    migrations: [], // Add migrations if needed
    subscribers: [], // Add subscribers if needed
    extra: {
        connectTimeout: 1000000, // Increase connection timeout to 100 seconds
    },
});

async function main() {
    await AppDataSource.initialize().then(async () => {
        console.log("Database connection established!");

        // Synchronize the schema (create tables if they don't exist)
        await AppDataSource.synchronize();
        console.log("Tables created successfully!");
    });
    console.log("Data Source has been initialized!");
}

main()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((error) => {
        console.error("Error during Data Source initialization:");
        console.log(error)
    });

// Handle clean shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await AppDataSource.destroy();
    console.log("Database connection closed.");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Shutting down server...");
    await AppDataSource.destroy();
    console.log("Database connection closed.");
    process.exit(0);
});