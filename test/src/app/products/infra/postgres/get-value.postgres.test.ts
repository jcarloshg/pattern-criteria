import { GetValuePostgres } from "@/app/products/infra/postgres/get-value.postgres";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

describe('get-value.postgres.test', () => {
    it('should be defined', async () => {

        const getValuePostgres = new GetValuePostgres(postgresManager)
        const res = await getValuePostgres.run("name", "ASC");
        expect(getValuePostgres).toBeDefined();
    });
})