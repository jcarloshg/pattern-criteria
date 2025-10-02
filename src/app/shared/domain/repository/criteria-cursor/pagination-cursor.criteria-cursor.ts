import { CriteriaError } from "../../errors/criteria.error";


export class PaginationCursor {

    public pageSize: number;

    constructor(pageSize: number = 10) {
        this.pageSize = pageSize;
    }

    public static fromPrimitives(
        pageSize: string
    ): PaginationCursor {
        try {

            const pageSizeNumber = parseInt(pageSize, 10);
            const isNotNumberPageSize = isNaN(pageSizeNumber);
            if (isNotNumberPageSize) throw new Error("Page size must be a number");
            if (pageSizeNumber < 1) throw new Error("Page size must be greater than 0");

            return new PaginationCursor(pageSizeNumber);

        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}
