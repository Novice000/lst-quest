import { Schema } from "mongoose"

export interface ICard {
    _id?: Schema.Types.ObjectId,
    numberCrypto: string,
    cvvCrypto: string,
    expiryDateCrypto: string
}