import mongoose, {Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";


const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    accountDetails: {
        type: Schema.Types.ObjectId,
        ref: "Account",
    }
})


const User =  mongoose.model<IUser>('User', userSchema)
export default User

