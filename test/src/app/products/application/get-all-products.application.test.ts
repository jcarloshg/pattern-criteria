import { GetAllProductsApplication } from "@/app/products/application/get-all-products.application";
import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres";
import { GetTotalOfProductsPostgres } from "@/app/products/infra/postgres/get-total-of-products.postgress";
import { URLSearchToCriteria } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

describe("get-all-products.application.test", () => {
    it("should return all products", async () => {
        // parse criteria from url
        const urlBase = "http://localhost:3000/api/products/v1";
        const urlPagination = "?&page=1&pageSize=10";
        const url = `${urlBase}${urlPagination}`;
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);

        // init services
        const getAllProductsRepo = new GetAllProductsPostgres(postgresManager);
        const getTotalOfProductsRepo = new GetTotalOfProductsPostgres(
            postgresManager
        );

        // execute application
        const useCase = new GetAllProductsApplication(
            getAllProductsRepo,
            getTotalOfProductsRepo
        );

        const result = await useCase.run({ criteria });

        // assertions
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        if (result.data === undefined) throw new Error("result.data is undefined");
        expect(result.data.data.length).toBeGreaterThan(0);
        expect(result.data.total).toBeGreaterThan(0);
        expect(result.data.totalPages).toBeGreaterThan(0);
    });

    it("should return products with order", async () => {
        // parse criteria from url
        const urlBase = "http://localhost:3000/api/products/v1";
        const urlPagination = "?&page=1&pageSize=10";
        const urlOrder = "&orderBy=price&order=ASC";
        const url = `${urlBase}${urlPagination}${urlOrder}`;
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);

        // init services
        const getAllProductsRepo = new GetAllProductsPostgres(postgresManager);
        const getTotalOfProductsRepo = new GetTotalOfProductsPostgres(
            postgresManager
        );

        // execute application
        const useCase = new GetAllProductsApplication(
            getAllProductsRepo,
            getTotalOfProductsRepo
        );

        const result = await useCase.run({ criteria });

        // assertions
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        const productsRes = result.data;
        if (productsRes === undefined) throw new Error("result.data is undefined");

        const productsCopy = [...productsRes.data];
        productsCopy.sort((a, b) => a.price - b.price);

        expect(productsRes.data.length).toBeGreaterThan(0);
        expect(productsRes.total).toBeGreaterThan(0);
        expect(productsRes.totalPages).toBeGreaterThan(0);
        expect(productsRes.data).toEqual(productsCopy);
    });

    it("should return products filtered by name and price", async () => {
        // parse criteria from url
        const urlBase = "http://localhost:3000/api/products/v1";
        const urlPagination = "?&page=1&pageSize=10";
        const urlOrder = "&orderBy=price&order=ASC";
        const urlFilter1 = "&[0][field]=name&[0][operator]=CONTAINS&[0][values]=[coffe, cheesy]";
        const urlFilter2 = "&[1][field]=price&[1][operator]=GET&[1][values]=[5]";
        const url = `${urlBase}${urlPagination}${urlOrder}${urlFilter1}${urlFilter2}`;
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);

        // init services
        const getAllProductsRepo = new GetAllProductsPostgres(postgresManager);
        const getTotalOfProductsRepo = new GetTotalOfProductsPostgres(
            postgresManager
        );

        // execute application
        const useCase = new GetAllProductsApplication(
            getAllProductsRepo,
            getTotalOfProductsRepo
        );

        const result = await useCase.run({ criteria });

        // assertions
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        const productsRes = result.data;
        if (productsRes === undefined) throw new Error("result.data is undefined");

        // check the ordening by price ASC
        const productsCopy = [...productsRes.data];
        productsCopy.sort((a, b) => a.price - b.price);
        expect(productsRes.data).toEqual(productsCopy);

        // check the filtering by name and price
        productsRes.data.forEach((product) => {
            expect(
                product.name.toLowerCase().includes("coffe") ||
                product.name.toLowerCase().includes("cheesy")
            ).toBe(true);
            expect(product.price).toBeGreaterThan(5);
        });

    });
});
