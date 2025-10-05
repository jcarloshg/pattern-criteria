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
            const url = "http://localhost:3000/api/products/v1?&page=1&pageSize=10&orderBy=price&order=bbb";
            const searchParams = new URL(url).searchParams;
            URLSearchToCriteria.parse(searchParams);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[order] is invalid");
        }
    });

    it("should be defined", () => {
        const url = "http://localhost:3000/api/products/v1?&page=1&pageSize=10&orderBy=price&order=ASC";
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);
        expect(criteria).toBeDefined();
        expect(criteria.pagination.page).toBe(1);
        expect(criteria.pagination.pageSize).toBe(10);
    });


});
