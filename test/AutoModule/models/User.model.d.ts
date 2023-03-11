import { Model } from 'sequelize-typescript';
export declare class User extends Model {
    firstName: string;
    lastName: string;
    isActive: boolean;
}
