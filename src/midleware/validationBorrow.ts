import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const borrowValidationSchema = Joi.object({

    item_id: Joi.number().integer().required(),
    quantity: Joi.number().positive().required()
});

export const returnValidationSchema = Joi.object({
    borrow_id: Joi.number().integer().required(),
    return_date: Joi.date().iso().required(),
    quantity: Joi.number().positive().required()

});

export const validateBorrowData = (request: Request, response: Response, next: NextFunction) => {
    const { error } = borrowValidationSchema.validate(request.body, { abortEarly: false });

    if (error) {
        return response.status(400).json({
            status: "failed",
            message: error.details.map((it) => it.message).join(', ')
        });
    }
    return next();
};

export const validateReturnData = (request: Request, response: Response, next: NextFunction) => {
    const { error } = returnValidationSchema.validate(request.body, { abortEarly: false });

    if (error) {
        return response.status(400).json({
            status: "failed",
            message: error.details.map((it) => it.message).join(', ')
        });
    }
    return next();
};
