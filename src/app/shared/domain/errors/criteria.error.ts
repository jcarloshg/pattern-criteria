import { CustomError } from "./custom-error.error";

export class CriteriaError extends CustomError {
    constructor(error: unknown) {

        let errorMessage = "[UNKNOWN-ERROR]";
        if (error instanceof Error) errorMessage = error.message;
        if (typeof error === "string") errorMessage = error;

        super(errorMessage);
        this.name = "CriteriaError";
    }
}