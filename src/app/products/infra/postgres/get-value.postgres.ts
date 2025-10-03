import { PostgresManagerType } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { GetValueRepository } from "../../domain/repository/get-value.repository";

export class GetValuePostgres implements GetValueRepository {

    constructor(
        private readonly PostgresManager: PostgresManagerType
    ) { }

    public async run(column: string, direction: "ASC" | "DESC"): Promise<string> {
        const query = `SELECT ${column} FROM product ORDER BY ${column} ${direction} LIMIT 1;`;
        try {
            const response = await this.PostgresManager.runQuery(query);
            console.log(`Response from Postgres: `, response);
            const rows = response.rows;
            return rows[0][column];
        } catch (error) {
            console.error("Error in GetValuePostgres:", error);
            throw new Error("Error fetching value");
        }
    }

}