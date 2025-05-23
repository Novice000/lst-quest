import User from "../models/user.model"
import Card from "../models/card.model"
import Account from "../models/account.model"
import { IUserInput } from "../interfaces/user.interface";


class UserService {
    static async getAllUsers() {
        return User.find()
    }

    static async getUserById(id: string) {
        return User.findById(id)
    }

    static async createUser(userInput: IUserInput) {
        const user = new User(userInput);
        return user.save();
    }

    static async updateUser(id: string, userInput: IUserInput) {
        return User.findByIdAndUpdate(id, userInput, { new: true });
    }

    static getUserByEmail(email: string) {
        return User.findOne({ email });
    }
}

export default UserService;