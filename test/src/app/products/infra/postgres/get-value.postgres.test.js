"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_value_postgres_1 = require("@/app/products/infra/postgres/get-value.postgres");
const postgress_manager_1 = require("@/app/shared/infrastructure/database/postgres/postgress-manager");
describe('get-value.postgres.test', () => {
    it('should be defined', async () => {
        const getValuePostgres = new get_value_postgres_1.GetValuePostgres(postgress_manager_1.postgresManager);
        const res = await getValuePostgres.run("name", "ASC");
        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(0);
        expect(getValuePostgres).toBeDefined();
    });
});
//# sourceMappingURL=get-value.postgres.test.js.map