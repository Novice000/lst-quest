import mongoose, {Schema} from "mongoose";
import { ICard } from "../interfaces/card.interface";

const cardSchema = new Schema<ICard>({
    numberCrypto: {
        type: String,
        required: true
    },
    cvvCrypto: {
        type: String,
        required: true
    },
    expiryDateCrypto: {
        type: String,
        required: true
    }
})

const Card = mongoose.model<ICard>('Card', cardSchema)
export default Card