import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";
import BaseController from './baseController';
import * as UserModel from '../models/user.model';
import { USERROLES, JWTSECRET, STATUS } from '../configs/CONSTANTS'
import { IUser, IUserRepository } from '../libs/repository/interfaces'

export default class userController extends BaseController {
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

					    return this.userRepository.create(newUser)
				    })
				    .then((user) => this.createToken(user))
				    .then((token) => {
					    reply({
						    status: STATUS.SUCCESSFUL
						}).code(201);
				    })
				    .catch((error) => {
					    console.log(error);
				    	reply(Boom.badImplementation('Could not create user. Please try again later or contact support'));
					});
			},
			auth: false,
			validate: {
				payload: UserModel.createUserModel
			},
			tags: ['api', 'user', 'signup'],
			description: 'Creates a new user account',
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Creates a new user account',
							'schema': UserModel.createUserModel
						}
					}
				}
			}
		}
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
					.then((token) => {
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
							'schema': UserModel.authenticationModel
						}
					}
				}
			}
		}
	}

	public deleteUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				this.verifyCredentials(request.payload.email, request.payload.password)
				    .then((user: IUser) => {
				    	this.userRepository.findByIdAndDelete(user._id)
					        .then((results) => {
						        reply({
						        	status: STATUS.SUCCESSFUL
						        }).code(201);
					        })
					        .catch(error => reply(Boom.badImplementation(error)));
				    })
				    .catch((error) => {
				    	console.log(error);
					    reply(Boom.badData('Incorrect Password'));
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
							'schema': UserModel.deleteUserModel
						}
					},
					security: [{
						'jwt': []
					}]
				}
			}
		}
	}

	private verifyCredentials(email: string, password: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userRepository.find({
				email
			}, 1, 0).then((user) => {
				if(user.length) {
					let existingUser: IUser = user[user.length - 1];
					Bcrypt.compare(password, existingUser.password, (error, isValid) => {
						if(isValid) {
							return resolve(existingUser);
						}

						// Maybe we can send "Incorrect Password" message,
						// but that would make it possible to brute-force
						return reject('User account doesn\'t exist');
					})
				} else {
					return reject('User account doesn\'t exist');
				}
			});
		});
	}

	private verifyUniqueUser(email: string):Promise<any> {
		return new Promise((resolve, reject) => {
			this.userRepository.find({
				email
			}, 1, 0).then((user) => {
				if(!user.length) {
					return resolve();
				} else {
					return reject('User already exists');
				}
			});
		});
	}

	private hashPassword(password): Promise<any> {
		return new Promise((resolve, reject) => {
			Bcrypt.genSalt(10, (error, salt) => {
				if(error) {
					reject('Error generating password salt');
				}

				Bcrypt.hash(password, salt, (error, hash) => {
					if(error) {
						reject('Error hashing password');
					}

					resolve(hash);
				});
			});
		});
	}

	private createToken(user: IUser): Promise<any> {
		const { _id, email } = user;
		return new Promise((resolve, reject) => {
			JWT.sign({
				_id,
				email
			}, JWTSECRET, {
				expiresIn: 60,
			}, (error, jwt) => {
				if(error){
					reject('Could not create JWT token');
				}

				resolve(jwt);
			});
		});
	}
}