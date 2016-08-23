import {JWTSECRET} from "../../configs/environment";
import * as JWT from "jsonwebtoken";
import * as Bcrypt from "bcrypt";
import {IUser} from "../repository/interfaces";

export default class Utilties {
	public hashPassword(password): Promise<any> {
		return new Promise((resolve, reject) => {
			Bcrypt.genSalt(10, (error, salt) => {
				if (error) {
					reject('Error generating password salt');
				}

				Bcrypt.hash(password, salt, (error, hash) => {
					if (error) {
						reject('Error hashing password');
					}

					resolve(hash);
				});
			});
		});
	}

	public createToken(user: IUser): Promise<any> {
		const { _id, email, userRole } = user;
		return new Promise((resolve, reject) => {
			JWT.sign({
				_id,
				email,
				userRole
			}, JWTSECRET, {
				expiresIn: 3600, // 1 hour
			}, (error, jwt) => {
				if (error) {
					reject('Could not create token');
				}

				resolve(jwt);
			});
		});
	}
}
