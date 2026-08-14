// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { OAuthTokens } from "./entity/OauthTokens";

const isProduction = process.env.NODE_ENV === "production";

const dbHost = process.env.DB_HOST || "localhost";
const dbName = process.env.DB_NAME || "spring";
const dbUser = process.env.DB_USER || "rachitanil";
const dbPassword = process.env.DB_PASSWORD || "root";
const dbPort = Number(process.env.DB_PORT || process.env.SQL_PORT || 3306);

if (isProduction) {
    const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required database env vars: ${missing.join(", ")}`);
    }
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    // Auto-sync for local development, or one-time prod bootstrap via DB_SYNCHRONIZE=true.
    synchronize: !isProduction || process.env.DB_SYNCHRONIZE === "true",
    logging: !isProduction,
    entities: [User, OAuthTokens],
    migrations: [],
    subscribers: [],
    extra: {
        connectTimeout: 1000000,
    },
});

async function main() {
    await AppDataSource.initialize().then(async () => {
        console.log("Database connection established!");

        if (!isProduction || process.env.DB_SYNCHRONIZE === "true") {
            await AppDataSource.synchronize();
            console.log("Tables synchronized successfully!");
        }
    });
    console.log("Data Source has been initialized!");
}

main()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((error) => {
        console.error("Database connection / initialization failed:");
        console.log(error);
        if (isProduction) {
            process.exit(1);
        }
    });

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
