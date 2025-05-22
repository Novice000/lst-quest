import mongoose, {Schema} from "mongoose";
import { IAccount } from "../interfaces/account.interface";

const account = new Schema<IAccount>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    cardDetails: [{
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: true
    }]
})


const Account = mongoose.model<IAccount>('Account', account)
export default Account