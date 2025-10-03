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
            const rows = response.rows;
            if (rows.length === 0) throw new Error("No data found");
            return rows[0][column] as string;
        } catch (error) {
            console.error("Error in GetValuePostgres:", error);
            throw new Error("Error fetching value");
        }
    }

}