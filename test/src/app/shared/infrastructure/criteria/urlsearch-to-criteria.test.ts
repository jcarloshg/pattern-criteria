import { URLSearchToCriteria } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria";

describe("urlsearch-to-criteria.test", () => {
    it("should be error: [page] must be a number", () => {
        try {
            const url = "http://localhost:3000/api/products/v1";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[page] must be a number");
        }
    });

    it("should be error: [page] must be greater than 0", () => {
        try {
            const url = "http://localhost:3000/api/products/v1?page=0";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[page] must be greater than 0");
        }
    });

    it("should be error: [pageSize] must be a number", () => {
        try {
            const url = "http://localhost:3000/api/products/v1?&page=1&pageSize=two";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[pageSize] must be a number");
        }
    });

    it("should be error: [pageSize] must be greater than 0", () => {
        try {
            const url = "http://localhost:3000/api/products/v1?&page=1&pageSize=0";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[pageSize] must be greater than 0");
        }
    });

    it("should be error: [orderBy] is invalid", () => {
        try {
            const url =
                "http://localhost:3000/api/products/v1?&page=1&pageSize=10&orderBy=price&order=bbb";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[order] is invalid");
        }
    });

    it("should be error: [operator] is invalid", () => {
        try {
            const urlBase = "http://localhost:3000/api/products/v1";
            const urlPagination = "?&page=1&pageSize=10";
            const urlOrder = "&orderBy=price&order=ASC";
            const urlFilter1 =
                "&[0][field]=name&[0][operator]=CONTAINSBLA&[0][values]=[Travel]";
            const url = `${urlBase}${urlPagination}${urlOrder}${urlFilter1}`;
            const searchParams = new URL(url).searchParams;
            const criteria = URLSearchToCriteria.parse(searchParams);
            expect(criteria).toBeDefined();
            expect(criteria.pagination.page).toBe(1);
            expect(criteria.pagination.pageSize).toBe(10);
            expect(criteria.orders.orderBy).toBe("price");
            expect(criteria.orders.order).toBe("ASC");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[operator] is invalid");
        }
    });

    it("should be error: [values] must contain at least one non-empty values", () => {
        try {
            const urlBase = "http://localhost:3000/api/products/v1";
            const urlPagination = "?&page=1&pageSize=10";
            const urlOrder = "&orderBy=price&order=ASC";
            const urlFilter1 = "&[0][field]=name&[0][operator]=CONTAINS&[0][values]=Travel";
            const url = `${urlBase}${urlPagination}${urlOrder}${urlFilter1}`;
            const searchParams = new URL(url).searchParams;
            const criteria = URLSearchToCriteria.parse(searchParams);
            expect(criteria).toBeDefined();
            expect(criteria.pagination.page).toBe(1);
            expect(criteria.pagination.pageSize).toBe(10);
            expect(criteria.orders.orderBy).toBe("price");
            expect(criteria.orders.order).toBe("ASC");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[values] must contain at least one non-empty values");
        }
    });

    it("should be defined", () => {
        const urlBase = "http://localhost:3000/api/products/v1";
        const urlPagination = "?&page=1&pageSize=10";
        const urlOrder = "&orderBy=price&order=ASC";
        const urlFilter1 = "&[0][field]=name&[0][operator]=CONTAINS&[0][values]=[Travel, Adventure]";
        const urlFilter2 = "&[1][field]=price&[1][operator]=GT&[1][values]=[50]";
        const url = `${urlBase}${urlPagination}${urlOrder}${urlFilter1}${urlFilter2}`;
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);
        expect(criteria).toBeDefined();
        expect(criteria.pagination.page).toBe(1);
        expect(criteria.pagination.pageSize).toBe(10);
        expect(criteria.orders.orderBy).toBe("price");
        expect(criteria.orders.order).toBe("ASC");
        expect(criteria.filters.length).toBe(2);
        expect(criteria.filters[0].field).toBe("name");
        expect(criteria.filters[0].operator.value).toBe("CONTAINS");
        expect(criteria.filters[0].values).toEqual(["Travel", "Adventure"]);
        expect(criteria.filters[1].field).toBe("price");
        expect(criteria.filters[1].operator.value).toBe("GT");
        expect(criteria.filters[1].values).toEqual(["50"]);
    });
});
