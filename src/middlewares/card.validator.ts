import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
	numberCrypto: Joi.string().optional(),
	cvvCrypto: Joi.string().optional(),
	expiryDateCrypto: Joi.string().optional(),
});

export function validateCard(req: Request, res: Response, next: NextFunction) {
	const { error } = schema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details[0].message });
        return;
	}
	next();
}
