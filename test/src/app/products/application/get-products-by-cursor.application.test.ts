import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { UrlsearchToCriteriaCursor } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria-cursor";
import { GetProductsByCursorApplication } from "@/app/products/application/get-products-by-cursor.application";
import { GetProductsByCursorPostgres } from "@/app/products/infra/postgres/get-products-by-cursor.postgres";
import { GetValuePostgres } from "@/app/products/infra/postgres/get-value.postgres";

describe("get-products-by-cursor.application.test", () => {
    it("should work", async () => {
        // external services
        const getAllProductsRepo = new GetProductsByCursorPostgres(postgresManager);
        const getValuePostgres = new GetValuePostgres(postgresManager);
        // init use case
        const useCase = new GetProductsByCursorApplication(
            getAllProductsRepo,
            getValuePostgres
        );

        // ─────────────────────────────────────
        //  first step: simulate the request
        // ─────────────────────────────────────
        const urlString =
            "http://localhost:3000/api/products/v1/cursor?&value=&cursor=name&direction=ASC&pageSize=2";
        // init criteria cursor
        const url = new URL(urlString);
        const searchParams = url.searchParams;
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        const result = await useCase.run({ criteria: criteriaCursor });
        expect(result).toBeDefined();
        const resultData = result.data;
        if (!resultData) throw new Error("No data found");
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
        const criteriaCursor_02 = UrlsearchToCriteriaCursor.parse(searchParams_02);
        const result_02 = await useCase.run({ criteria: criteriaCursor_02 });
        expect(result_02).toBeDefined();
        const result_02_data = result_02.data;
        if (!result_02_data) throw new Error("No data found");
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
