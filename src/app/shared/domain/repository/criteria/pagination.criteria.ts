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

            if (isNotNumberPage) throw new Error("[page] must be a number");
            if (pageNumber < 1) throw new Error("[page] must be greater than 0");

            if (isNotNumberPageSize) throw new Error("[pageSize] must be a number");
            if (pageSizeNumber < 1) throw new Error("[pageSize] must be greater than 0");

            return new Pagination(pageNumber, pageSizeNumber);
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}
