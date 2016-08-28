import {IUser} from "../libs/repository/interfaces";

export interface IRepositoryConfig {
    username: string;
    password: string;
    host: string;
    port: number;
    protocol: string;
}

export interface IServerConfig {
    port: number;
}

export interface  IUtils {
    hashPassword(password: string): Promise<any>;
    createToken(user: IUser): Promise<any>;
}
