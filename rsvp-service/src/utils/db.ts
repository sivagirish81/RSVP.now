import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default {
    /**
     * Executes a query on the PostgreSQL database.
     * @param text - The SQL query string.
     * @param params - The parameters for the query.
     * @returns A promise that resolves to the query result.
     */
    query: async <T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        return pool.query<T>(text, params);
    },

    /**
     * Connects to the PostgreSQL database and logs the connection status.
     */
    connectToDb: async (): Promise<void> => {
        try {
            await pool.connect();
            console.log('Connected to the database successfully.');
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            process.exit(1);
        }
    },
};