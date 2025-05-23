import Joi from "joi";
import { IUserInput } from "../interfaces/user.interface";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
    firstName: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.date().required()
})

export function validateUserBody(req: Request, res: Response, next: NextFunction) {
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    } else {
        next();
    }
}