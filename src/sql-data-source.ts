// src/data-source.ts
import { DataSource, createConnection } from "typeorm";
import { User } from "./entity/User"; // Import your entity

export const AppDataSource = new DataSource({
    type: "mysql", // or 'postgres', 'sqlite', etc.
    host: "localhost",
    port: 3306,
    username: "rachitanil",
    password: "root",
    database: "spring",
    synchronize: true, // Automatically create database schema (for development only)
    logging: true, // Enable logging
    entities: [User], // Add your entities here
    migrations: [], // Add migrations if needed
    subscribers: [], // Add subscribers if needed
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

main().catch((error) => console.log(error));