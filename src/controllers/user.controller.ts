import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";
import BaseController from './baseController';
import * as UserModel from '../models/user.model';
import { USERROLES, JWTSECRET } from '../configs/CONSTANTS'
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
				    .then(() => {
				    	// Build hash from Password
				    	let hash: Promise<any>;
					    hash = this.hashPassword(request.payload.password)
					               .then((hash) => {
						               return hash;
					               })
					               .catch((error) => {
						               reply(Boom.badRequest(error));
					               });

					    return hash;
				    })
				    .then((hash) => {
					    let newUser: IUser;
					    newUser.firstName = request.payload.firstName;
					    newUser.lastName  = request.payload.lastName;
					    newUser.email     = request.payload.email;
					    newUser.password  = hash;
					    newUser.isActive  = false;
					    newUser.userRole  = USERROLES.STUDENT;
					    newUser.lastLogin = new Date();

					    this.userRepository.create(newUser)
					        .then((user) => {
					        	reply(user).code(201);
					        })
					        .catch((error) => {
					        	reply(Boom.badImplementation(error))
					        });
				    })
				    .catch(() => {
				    	reply(Boom.badRequest('User already exists'));
					});
			},
			auth: false,
			tags: ['api', 'user', 'signup'],
			description: 'Creates a new user account',
			validate: {
				payload: UserModel.createUserModel
			},
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

	public loginUser(): Hapi.IRouteAdditionalConfigurationOptions {
		return {
			handler: (request: Hapi.Request, reply: Hapi.IReply) => {
				this.verifyCredentials(request.payload.email, request.payload.password)
					.then((user: IUser) => {
						const token = this.createToken(user);
						let { userRole } = user;
						reply({
							token,
							userRole
						}).code(201);

						user.lastLogin = new Date();
						this.userRepository.findByIdAndUpdate(user._id, user);
					})
					.catch((error) => {
						reply(Boom.badRequest(error));
					})
			},
			auth: false,
			tags: ['api', 'user', 'login'],
			description: 'Logs users into app',
			validate: {
				payload: UserModel.loginModel
			},
			plugins: {
				'hapi-swagger': {
					responses: {
						'201': {
							'description': 'Logs users into app',
							'schema': UserModel.loginModel
						}
					}
				}
			}
		}
	}

	private verifyCredentials(email: string, password: string): Promise<any> {
		const user = new Promise((resolve, reject) => {
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
						// but that would make it possible to bruteforce
						return reject('User account doesn\'t exist');
					})
				} else {
					return reject('User account doesn\'t exist');
				}
			});
		});

		return user;
	}

	private verifyUniqueUser(email: string):Promise<any> {
		const uniqueUser = new Promise((resolve, reject) => {
			this.userRepository.find({
				email
			}, 1, 0).then((user) => {
				if(!user.length) {
					return resolve();
				} else {
					return reject('User exists');
				}
			});
		});

		return uniqueUser;
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
				})
			})
		});
	}

	private createToken(user: IUser) {
		const { _id, email } = user;
		return JWT.sign({
			_id,
			email
		}, JWTSECRET);
	}
}