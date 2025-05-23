import { Request, Response, NextFunction } from "express";
import AppError from "../utils/errors";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err)
	if (err instanceof AppError) {
		res.status(err.status).json({
			message: err.message,
		});
        return
	}
	res.status(500).json({ message: err.message });
}
