import { Request, Response } from "express";
import { IUserInput } from "../interfaces/user.interface";
import UserService from "../services/user.service";
import CardService from "../services/card.service";
import AccountService from "../services/account.service";
import { Schema } from "mongoose";
import { decrypt } from "../utils/util";
import AppError from "../utils/errors";

class AllController {
	static async CreateUserAndAccount(req: Request, res: Response) {
		const data: IUserInput = req.body;
		const existingUser = await UserService.getUserByEmail(data.email);
		if (existingUser) {
			throw new AppError(403, "User with this email already exists");
		}
		const user = await UserService.createUser(data);
		if (!user) {
			throw new AppError(500, "User creation failed");
		}
		const card = await CardService.createCard();
		if (!card) {
			throw new AppError(500, "Card creation failed");
		}
		const account = await AccountService.createAccount(
			user._id as unknown as Schema.Types.ObjectId,
			card._id as unknown as Schema.Types.ObjectId
		);
		if (!account) {
			throw new AppError(500, "Account creation failed");
		}
		res.status(201).json({
			message: "User created successfully",
			data: {
				user: user,
				account: account.accountNumber,
			},
		});
	}

	static async getAllAccounts(req: Request, res: Response) {
		const accounts = await AccountService.getAllAccounts();
		const data = accounts.map((account) => {
			return {
				fullName: account.user.firstName + " " + account.user.surname,
				accountNumber: account.accountNumber,
				encyptedcardDetails: account.cardDetails,
				decryptedCardDetails: {
					number: decrypt(account.cardDetails.numberCrypto),
					cvv: decrypt(account.cardDetails.cvvCrypto),
					expiryDate: decrypt(account.cardDetails.expiryDateCrypto),
				},
			};
		});

		res.status(200).json({
			message: "Accounts fetched successfully",
			data: data,
		});
	}

	static async decryptCardDetails(req: Request, res: Response) {
        const decryptedCardDetails = Object.assign({}, req.body);
		Object.keys(decryptedCardDetails).forEach((key) => {
			decryptedCardDetails[key] = decrypt(req.body[key]);
		});
		res.status(200).json({
			message: "Card details decrypted successfully",
			data: decryptedCardDetails,
		});
	}
}

export default AllController;
