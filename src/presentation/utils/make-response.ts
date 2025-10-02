import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { Response } from "express";

export const makeResponse = (
    res: Response,
    customResponse: CustomResponse<any>
): CustomResponse<any> => {
    res.status(customResponse.code).json(customResponse);
    return customResponse;
};
