import { UrlsearchToCriteriaCursor } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria-cursor"

describe('urlsearch-to-criteria-cursor.test', () => {

    it('should be -> Error: [value] is required', () => {
        try {
            const url = "http://localhost:3000/api/products/v1/cursor?&cursor=price&direction=ASC";
            const searchParams = new URL(url).searchParams;
            UrlsearchToCriteriaCursor.parse(searchParams);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[value] is required");
        }
    });

    it('should be -> Error: [cursor] is required', () => {
        try {
            const url = "http://localhost:3000/api/products/v1/cursor?&value=20&direction=ASC";
            const searchParams = new URL(url).searchParams;
            UrlsearchToCriteriaCursor.parse(searchParams);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[cursor] is required");
        }
    });

    it('should be -> Error: [direction] is required', () => {
        try {
            const url = "http://localhost:3000/api/products/v1/cursor?&value=20&cursor=price";
            const searchParams = new URL(url).searchParams;
            UrlsearchToCriteriaCursor.parse(searchParams);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[direction] is required");
        }
    });


    it('should be -> Error: [direction] is invalid', () => {
        try {
            const url = "http://localhost:3000/api/products/v1/cursor?&value=20&cursor=price&direction=BLABLABLA";
            const searchParams = new URL(url).searchParams;
            UrlsearchToCriteriaCursor.parse(searchParams);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            expect(errorMessage).toBe("[direction] is invalid");
        }
    });

    it('should be defined', () => {
        const url = "http://localhost:3000/api/products/v1/cursor?&value=20&cursor=price&direction=ASC";
        const searchParams = new URL(url).searchParams;
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        expect(criteriaCursor).toBeDefined()
        expect(criteriaCursor.filters.length).toBe(0);
        expect(criteriaCursor.pagination.pageSize).toBe(10);
    });

    it('should be defined with filters', () => {
        const url = "http://localhost:3000/api/products/v1/cursor?&value=20&cursor=price&direction=ASC&[0][field]=name&[0][operator]=CONTAINS&[0][value]=Travel&[1][field]=price&[1][operator]=GT&[1][value]=50";
        const searchParams = new URL(url).searchParams;
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        expect(criteriaCursor).toBeDefined()
        expect(criteriaCursor.filters.length).toBe(2);
        expect(criteriaCursor.filters[0].field).toBe("name");
        expect(criteriaCursor.filters[0].operator).toBe("CONTAINS");
        expect(criteriaCursor.filters[0].value).toBe("Travel");
        expect(criteriaCursor.filters[1].field).toBe("price");
        expect(criteriaCursor.filters[1].operator).toBe(">");
        expect(criteriaCursor.filters[1].value).toBe("50");
        expect(criteriaCursor.pagination.pageSize).toBe(10);
    });

    it('should be defined with pagination', () => {
        const url = "http://localhost:3000/api/products/v1/cursor?&value=20&cursor=price&direction=ASC&[0][field]=name&[0][operator]=CONTAINS&[0][value]=Travel&[1][field]=price&[1][operator]=GT&[1][value]=50&pageSize=25";
        const searchParams = new URL(url).searchParams;
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        expect(criteriaCursor).toBeDefined()
        expect(criteriaCursor.pagination.pageSize).toBe(25);
    });
})