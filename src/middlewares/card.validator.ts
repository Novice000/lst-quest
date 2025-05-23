import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
	numberCrypto: Joi.string().required(),
	cvvCrypto: Joi.string().required(),
	expiryDateCrypto: Joi.string().required(),
});

export function validateCard(req: Request, res: Response, next: NextFunction) {
	const { error } = schema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details[0].message });
        return;
	}
	next();
}
