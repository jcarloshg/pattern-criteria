
export class CustomResponse<T = undefined> {
    constructor(
        public code: number,
        public message: string,
        public data: T
    ) { }

    // ============================================================
    // 200
    // ============================================================

    static ok<T>(data: T, message: string = "Request was successful"): CustomResponse<T> {
        return new CustomResponse<T>(200, message, data);
    }

    static created<T>(objectCreated: T): CustomResponse<T> {
        return new CustomResponse<T>(
            201,
            "Resource created successfully",
            objectCreated
        );
    }

    // ============================================================
    // 400
    // ============================================================

    static badRequest(userMessage: string): CustomResponse {
        return new CustomResponse(400, userMessage, undefined);
    }

    static notFound(message: string = "Resource not found"): CustomResponse<null> {
        return new CustomResponse<null>(404, message, null);
    }

    // ============================================================
    // 500
    // ============================================================

    static internalServerError(): CustomResponse<undefined> {
        return new CustomResponse(
            500,
            "Internal server error",
            undefined
        );
    }
}
