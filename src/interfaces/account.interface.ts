import { ICard } from "./card.interface";
import { IUser } from "./user.interface";


export interface IAccount{
    user: IUser,
    accountNumber: string,
    cardDetails: ICard,
}