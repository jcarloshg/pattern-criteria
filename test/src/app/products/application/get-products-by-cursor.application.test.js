"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgress_manager_1 = require("@/app/shared/infrastructure/database/postgres/postgress-manager");
const urlsearch_to_criteria_cursor_1 = require("@/app/shared/infrastructure/criteria/urlsearch-to-criteria-cursor");
const get_products_by_cursor_application_1 = require("@/app/products/application/get-products-by-cursor.application");
const get_products_by_cursor_postgres_1 = require("@/app/products/infra/postgres/get-products-by-cursor.postgres");
const get_value_postgres_1 = require("@/app/products/infra/postgres/get-value.postgres");
describe("get-products-by-cursor.application.test", () => {
    it("should work", async () => {
        // external services
        const getAllProductsRepo = new get_products_by_cursor_postgres_1.GetProductsByCursorPostgres(postgress_manager_1.postgresManager);
        const getValuePostgres = new get_value_postgres_1.GetValuePostgres(postgress_manager_1.postgresManager);
        // init use case
        const useCase = new get_products_by_cursor_application_1.GetProductsByCursorApplication(getAllProductsRepo, getValuePostgres);
        // ─────────────────────────────────────
        //  first step: simulate the request
        // ─────────────────────────────────────
        const urlString = "http://localhost:3000/api/products/v1/cursor?&value=&cursor=name&direction=ASC&pageSize=2";
        // init criteria cursor
        const url = new URL(urlString);
        const searchParams = url.searchParams;
        const criteriaCursor = urlsearch_to_criteria_cursor_1.UrlsearchToCriteriaCursor.parse(searchParams);
        const result = await useCase.run({ criteria: criteriaCursor });
        expect(result).toBeDefined();
        const resultData = result.data;
        if (!resultData)
            throw new Error("No data found");
        expect(resultData).toBeDefined();
        expect(resultData.data).toBeDefined();
        expect(resultData.data.length).toBeLessThanOrEqual(2);
        expect(resultData.cursor).toBeDefined();
        // get data from the first request
        // ─────────────────────────────────────
        //  second step: simulate the second request
        // ─────────────────────────────────────
        const urlString_02 = `http://localhost:3000/api/products/v1/cursor?&value=${resultData.cursor.value}&cursor=name&direction=ASC&pageSize=2`;
        // init criteria cursor
        const url_02 = new URL(urlString_02);
        const searchParams_02 = url_02.searchParams;
        const criteriaCursor_02 = urlsearch_to_criteria_cursor_1.UrlsearchToCriteriaCursor.parse(searchParams_02);
        const result_02 = await useCase.run({ criteria: criteriaCursor_02 });
        expect(result_02).toBeDefined();
        const result_02_data = result_02.data;
        if (!result_02_data)
            throw new Error("No data found");
        expect(result_02_data).toBeDefined();
        expect(result_02_data.data).toBeDefined();
        expect(result_02_data.data.length).toBeLessThanOrEqual(2);
        expect(result_02_data.cursor).toBeDefined();
        // ─────────────────────────────────────
        //  third step: compare both requests
        // ─────────────────────────────────────
        const firstResultData = resultData.data;
        const secondResultData = result_02_data.data;
        const lastItemOfFirstResult = firstResultData[firstResultData.length - 1];
        const lastItemName = lastItemOfFirstResult.name;
        const firstItemOfSecondResult = secondResultData[0];
        const firstItemName = firstItemOfSecondResult.name;
        expect(lastItemName <= firstItemName).toBeTruthy();
    });
});
//# sourceMappingURL=get-products-by-cursor.application.test.js.map