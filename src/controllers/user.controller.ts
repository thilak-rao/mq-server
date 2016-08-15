import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Joi from "joi";
import * as Bcrypt from "bcrypt";
import BaseController from './baseController';
import * as UserModel from '../models/user.model';
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
				this.verifyUniqueUser(request)
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
					    let newUser = <IUser>{
						    firstName: request.payload.firstName,
						    lastName: request.payload.lastName,
						    email: request.payload.email,
						    password: hash,
						    isActive: false,
						    lastLogin: new Date()
					    };

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
			tags: ['api', 'user'],
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

	public verifyUniqueUser(request: Hapi.Request):Promise<any> {
		const uniqueUser = new Promise((resolve, reject) => {
			this.userRepository.find({
				email: request.payload.email
			}, 1, 0).then((user) => {
				if(user.length === 0) {
					return resolve();
				} else {
					return reject('User exists');
				}
			})
		});

		return uniqueUser;
	}

	public hashPassword(password): Promise<any> {
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
}