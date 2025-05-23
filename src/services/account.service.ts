import { isValidObjectId, ObjectId, Schema } from "mongoose";
import Account from "../models/account.model";
import { getSecure10Digit } from "../utils/util";

class AccountService {
	static async createAccount(userID: Schema.Types.ObjectId, cardID: Schema.Types.ObjectId) {
		if (isValidObjectId(userID) && isValidObjectId(cardID)) {
			let accountNumber = getSecure10Digit();
			let found = await AccountService.getAccountByAccountNumber(accountNumber);
			while (found) {
				found = await AccountService.getAccountByAccountNumber(accountNumber);
				accountNumber = getSecure10Digit();
			}
			return Account.create({
				user: userID,
				accountNumber,
				cardDetails: cardID,
			});
		}
		throw new Error("Invalid user ID or card ID");
	}

	static async getAllAccounts() {
		return Account.find().populate("user", "-__v"
        ).populate("cardDetails", "-__v -_id");
	}

	static async getAccountById(id: string) {
		return Account.findById(id)
			.populate("user", "-__v -_id")
			.populate("cardDetails", "-__v -_id");
	}

	static async getAccountByAccountNumber(accountNumber: string) {
		return Account.findOne({ accountNumber });
	}
}

export default AccountService;
