import { IAccount } from "./account.interface"

export interface IUser {
    firstName: string,
    surname: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: Date,
    accountDetails: IAccount
}

export interface IUserInput {
    firstName: string,
    surname: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: Date
}
