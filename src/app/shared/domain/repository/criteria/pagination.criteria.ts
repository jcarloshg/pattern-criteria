import { CriteriaError } from "../../errors/criteria.error";

export class Pagination {
    public page: number;
    public pageSize: number;

    constructor(page: number = 1, pageSize: number = 10) {
        this.page = page;
        this.pageSize = pageSize;
    }

    public static fromPrimitives(page: string, pageSize: string): Pagination {
        try {
            const pageNumber = parseInt(page, 10);
            const pageSizeNumber = parseInt(pageSize, 10);

            const isNotNumberPage = isNaN(pageNumber);
            const isNotNumberPageSize = isNaN(pageSizeNumber);

            if (isNotNumberPage) throw new Error("Page must be a number");
            if (isNotNumberPageSize) throw new Error("Page size must be a number");

            if (pageSizeNumber && !pageNumber) throw new Error("Page is required when page size is provided");
            if (pageNumber < 1) throw new Error("Page must be greater than 0");
            if (pageSizeNumber < 1) throw new Error("Page size must be greater than 0");

            return new Pagination(pageNumber, pageSizeNumber);
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}
