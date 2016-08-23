import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";
import BaseController from './baseController';
import * as UserModel from '../models/user.model';
import * as ErrorModel from '../models/error.model';
import {USERROLES, STATUS, ERROR_MSG} from '../configs/constants';
import {JWTSECRET} from '../configs/environment';
import { IUser, IUserRepository } from '../libs/repository/interfaces';

export default class UserController extends BaseController {
	private userRepository: IUserRepository;

	constructor(server: Hapi.Server, userRepository: IUserRepository) {
		super(server);
		this.userRepository = userRepository;
	}

	public createUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				this.verifyUniqueUser(request.payload.email)
				    .then(() => this.hashPassword(request.payload.password))
				    .then((hash) => {
				    	// Persist User in Mongo
					    let newUser: IUser = <IUser>{};
					    newUser.firstName = request.payload.firstName;
					    newUser.lastName  = request.payload.lastName;
					    newUser.email     = request.payload.email;
					    newUser.password  = hash;
					    newUser.isActive  = false;
					    newUser.userRole  = USERROLES.STUDENT;
					    newUser.lastLogin = new Date();

					    return this.userRepository.create(newUser);
				    })
				    .then((user: IUser) => this.createToken(user))
				    .then(() => {
					    reply({
						    status: STATUS.SUCCESSFUL
						}).code(201);
				    })
				    .catch((error) => {
					    console.log(`${error} | Payload: ${JSON.stringify(request.payload)}`);
				    	reply(Boom.badRequest(error));
					});
			},
			auth: false,
			validate: {
				payload: UserModel.createUserModel
			},
			tags: ['api', 'user', 'create'],
			description: 'Creates a new user account',
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Creates a new user account',
							'schema'     : UserModel.createUserModel
						},
						'400': {
							'description': 'Could not create user',
							'schema'     : ErrorModel.badRequest
						}
					}
				}
			}
		};
	}

	public authenticateUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				let user: IUser;

				this.verifyCredentials(request.payload.email, request.payload.password)
					.then((userObj: IUser) => {
						user = userObj;
						return this.createToken(user);
					})
					.then((token: string) => {
						let { userRole } = user;

						reply({
							status: STATUS.SUCCESSFUL,
							token,
							userRole
						}).code(201);

						user.lastLogin = new Date();

						return this.userRepository.findByIdAndUpdate(user._id, user);
					})
					.catch((error) => {
						console.log(`${error} | Payload: ${JSON.stringify(request.payload)}`);
						reply(Boom.badRequest(error));
					});
			},
			auth: false,
			validate: {
				payload: UserModel.authenticationModel
			},
			tags: ['api', 'user', 'login'],
			description: 'Logs users into app',
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Logs users to access MagicQuill resources, and returns a JSON Web Token',
							'schema'     : UserModel.authenticationModel
						},
						'400': {
							'description': 'Could not login user',
							'schema'     : ErrorModel.badRequest
						}
					}
				}
			}
		};
	}

	public deleteUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				this.verifyCredentials(request.payload.email, request.payload.password)
				    .then((user: IUser) => {
				    	this.userRepository.findByIdAndDelete(user._id)
					        .then(() => {
						        reply({
						        	status: STATUS.SUCCESSFUL
						        }).code(201);
					        })
					        .catch((error) => {
						        console.log(`${error} | Payload: ${JSON.stringify(request.payload)}`);
					        	reply(Boom.badRequest(error));
					        });
				    })
				    .catch((error) => {
					    console.log(`${error} | Payload: ${JSON.stringify(request.payload)}`);
					    reply(Boom.badRequest(error));
				    });
			},
			validate: {
				payload: UserModel.deleteUserModel
			},
			tags: ['api', 'user', 'delete'],
			description: 'Deletes user account',
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Deletes a given MagicQuill user account',
							'schema'     : UserModel.deleteUserModel
						},
						'400': {
							'description': 'Could not delete user',
							'schema'     : ErrorModel.badRequest
						}
					},
					security : [{
						'jwt': []
					}]
				}
			}
		};
	}

	public updateUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				const payload: any = request.payload;
				const hasPwdChanged: Boolean = payload.hasOwnProperty('oldPassword') && payload.hasOwnProperty('newPassword');

				let user: IUser;
				this.getUser(request)
				    .then((userObj: IUser) => {
					    user = userObj;
					    if (hasPwdChanged) {
						    return this.verifyCredentials(user.email, payload['oldPassword']);
					    }
				    })
				    .then(() => {
					    if (hasPwdChanged) {
						    return this.hashPassword(payload['newPassword']);
					    }
				    }).then((hash: string) => {
						if (hasPwdChanged && typeof hash === 'string') {
							user.password = hash;
							console.log(`Password Changed for user ${user.email}`);
						}

						// check if any other user properties need to be changed
						for (const key in payload) {
							if (payload.hasOwnProperty(key) && user.hasOwnProperty(key)) {
								if (payload[key] !== user[key]) {
									console.log(`Changing ${key} for user ${user.email}`);
									user[key] = payload[key];
								}
							}
						}

						return this.userRepository.findByIdAndUpdate(user._id, user);
					})
					.then(() => {
						reply({
							status: STATUS.SUCCESSFUL
						}).code(201);
					})
					.catch((error) => {
						console.log(`${error} | Payload: ${JSON.stringify(request.payload)}`);
						reply(Boom.badRequest(error));
					});
			},
			validate: {
				payload: UserModel.updateUserModel
			},
			tags: ['api', 'user', 'update'],
			description: 'Updates user account',
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Updates a given MagicQuill user account',
							'schema'     : UserModel.updateUserModel
						},
						'400': {
							'description': 'Could not update user',
							'schema'     : ErrorModel.badRequest
						}
					},
					security : [{
						'jwt': [] //TODO: Ensure, Hapi Swagger Documents Security Definitions
					}]
				}
			}
		};
	}

	private getUser(request: Hapi.Request): Promise<any> {
		return new Promise((resolve, reject) => {
			let { _id } = request.auth.credentials;
			this.userRepository.find({
				_id
			}, 1, 0).then((user) => {
				if (user.length) {
					let userObj: IUser = user[user.length - 1];
					resolve(userObj);
				} else {
					return reject(ERROR_MSG.USR_DOESNT_EXIST);
				}
			});
		});
	}

	private verifyCredentials(email: string, password: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userRepository.find({
				email
			}, 1, 0).then((user: Array<IUser>) => {
				if (user.length) {
					let userObj: IUser = user[user.length - 1];
					Bcrypt.compare(password, userObj.password, (error, isValid) => {
						if (isValid) {
							return resolve(userObj);
						}

						return reject(ERROR_MSG.INCORRECT_PWD);
					});
				} else {
					return reject(ERROR_MSG.USR_DOESNT_EXIST);
				}
			});
		});
	}

	private verifyUniqueUser(email: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userRepository.find({
				email
			}, 1, 0).then((user: Array<IUser>) => {
				if (!user.length) {
					return resolve();
				} else {
					return reject(ERROR_MSG.USR_ALREADY_EXIST);
				}
			});
		});
	}

	private hashPassword(password): Promise<any> {
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

	private createToken(user: IUser): Promise<any> {
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
