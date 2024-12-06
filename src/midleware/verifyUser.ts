import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";
import { PrismaClient } from "@prisma/client";

// bikin skema dimana menambahkan hewan, semua fields harus diisi

const prisma = new PrismaClient();

export const addUserSchema = Joi.object({
    username: Joi.string().required(),
    role: Joi.string().valid('ADMIN', 'USER').required(),
    password: Joi.string().required()
})

export const updateUserSchema = Joi.object({
    username: Joi.string().optional(),
    role: Joi.string().valid('ADMIN', 'USER').optional(),
    password: Joi.string().optional()
})

export const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(3).alphanum().required()
})

export const verifyAuthentication = (request: Request, response: Response, next: NextFunction) => {
    const { error } = authSchema.validate(request.body, {abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}

export const verifyAddUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await addUserSchema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
  };

export const verifyEditUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await updateUserSchema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
  };