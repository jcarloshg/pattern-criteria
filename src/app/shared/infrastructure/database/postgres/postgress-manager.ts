import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";
import { enviromentVariables } from "@/app/shared/infrastructure/utils/enviroment-variables";

class PostgresManager {

    private pool: Pool;

    constructor() {
        this.pool = this.createPool();
    }

    private createPool(): Pool {
        const postgresEnv = enviromentVariables.POSTGRES_ENV;
        const pool = new Pool({
            connectionString: postgresEnv.POSTGRES_URL,
            user: postgresEnv.POSTGRES_USER,
            password: postgresEnv.POSTGRES_PASSWORD,
            database: postgresEnv.POSTGRES_DB,
        });
        return pool;
    }

    public async runQuery(query: string): Promise<QueryResult<any>> {
        let client: PoolClient | null = null;
        try {
            client = await this.pool.connect();
            const result = await client.query(query);
            return result;
        } catch (error) {
            console.error("Error executing query", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    }

    public async runParameterizedQuery(query: string, parameters: any[]): Promise<QueryResult<any>> {
        let client: PoolClient | null = null;
        try {
            client = await this.pool.connect();
            const result = await client.query(query, parameters);
            return result;
        } catch (error) {
            console.error("Error executing parameterized query", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    }
}

export const postgresManager = new PostgresManager();
export type PostgresManagerType = typeof postgresManager;
