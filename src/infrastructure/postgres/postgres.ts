import { DataSource, DataSourceOptions } from 'typeorm';
import {Task} from "../../modules/primitive/model";

// Default connection configurations
const defaultConnMaxLifetime = 5 * 60 * 1000; // default max 5 minutes in milliseconds
const defaultMaxOpenConns = 10; // default max 10 open connections
const defaultMaxIdleConns = 100000000; // default max 10 idle connections

// Function to create a new database client
export async function NewDatabaseClient(): Promise<DataSource> {
    // Database configuration options for TypeORM
    const host = process.env.postgres_host || 'localhost';
    const port = process.env.postgres_port || '5432';
    const user = process.env.postgres_user || 'postgres';
    const password = process.env.postgres_password || 'postgres';
    const dbName = process.env.postgres_dbname || 'coba_baru_whatsapp';

    let portPostgresql = parseInt(port);
    const dataSourceOptions: DataSourceOptions = {
        type: 'postgres',
        host: host,
        port: portPostgresql,
        username: user,
        password: password,
        database: dbName,
        ssl: false,
        synchronize: false,
        entities: [
            Task
        ],
        extra: {
            max: process.env.postgres_max_open_conn || defaultMaxOpenConns,
            idleTimeoutMillis: process.env.postgres_conn_lifetime || defaultConnMaxLifetime,
            connectionTimeoutMillis: process.env.postgres_max_idle_conn || defaultMaxIdleConns,
        },
    };

    // Create the DataSource instance
    const dataSource = new DataSource(dataSourceOptions);

    try {
        // Initialize the DataSource
        await dataSource.initialize();
        console.log("Database connection established successfully.");
        return dataSource;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
}
