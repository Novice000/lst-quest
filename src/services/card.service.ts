import { ICard } from "../interfaces/card.interface";
import Card from "../models/card.model";
import {
	encrypt,
	generateCVV,
	generateFutureExpiryDate,
	generateValidCardNumber,
} from "../utils/util";

class CardService {
	static async createCard(): Promise<ICard> {
		const numberCrypto = encrypt(generateValidCardNumber());
		const cvvCrypto = encrypt(generateCVV());
		const expiryDateCrypto = encrypt(generateFutureExpiryDate());
		const cardInput: ICard = {
			numberCrypto,
			cvvCrypto,
			expiryDateCrypto,
		};
		const card = new Card(cardInput);
		return card.save();
	}

	static async getAllCards() {
		return Card.find();
	}

	static async getCardById(id: string) {
		return Card.findById(id);
	}

	static async getCardByNumber(numberCrypto: string) {
		return Card.findOne({ numberCrypto });
	}

	static async updateCard(id: string, cardInput: ICard) {
		return Card.findByIdAndUpdate(id, cardInput, { new: true });
	}
}

export default CardService;
