/// <reference path="../typings/index.d.ts" />
import server from "../src/server";
import Utilities from "../src/libs/utils/utilities";
import {IServerInjectResponse, IServerInjectOptions} from "hapi";
import UserRepository from "../src/libs/repository/neo4j/user.repository";
import {STATUS, USER_API, USERROLES, ERROR_MSG} from "../src/configs/constants";
import {IUser} from "../src/libs/repository/interfaces";

const Code   = require('code'),
      UUID   = require("node-uuid"),
      moment = require('moment'),
      Lab    = require('lab'),
      utils  = new Utilities(),
      lab    = exports.lab = Lab.script();

/**
 * Variables required to test user api
 */
const USER_MODEL = {
	EMAIL    : 'test@magicquill.in',
	FIRSTNAME: 'John',
	LASTNAME : 'Doe',
	PASSWORD : 'supersecret',
	TOKEN    : ''
};

const USER_REPO: IUser = {
	_id        : UUID.v4(),
	email      : USER_MODEL.EMAIL,
	firstName  : USER_MODEL.FIRSTNAME,
	lastName   : USER_MODEL.LASTNAME,
	password   : USER_MODEL.PASSWORD,
	createdDate: moment().toJSON(),
	updatedAt  : moment().toJSON(),
	isActive   : true,
	lastLogin  : moment().toJSON(),
	userRole   : USERROLES.STUDENT
};

lab.experiment("\n\n\n***** User Repository *****\n", () => {
	const userRepo = new UserRepository();

	const verifyUserData = (result: any, done: Function) => {
		Code.expect(result).to.have.length(1);
		const data: IUser = result[0];

		for (const key in USER_REPO) {
			const hasAllProps = USER_REPO.hasOwnProperty(key) && data.hasOwnProperty(key);
			Code.expect(hasAllProps).to.be.true();

			if (hasAllProps) {
				Code.expect(data[key]).to.equal(USER_REPO[key]);
			}
		}
		done();
	};

	lab.test("Test create method", (done) => {
		utils.hashPassword(USER_MODEL.PASSWORD)
		     .then((hash) => {
			     Code.expect(hash).to.have.length(60);
			     USER_REPO.password = hash;
			     return userRepo.create(USER_REPO);
		     })
		     .then((result) => {
			     verifyUserData(result, done)
		     })
		     .catch((error) => {
			     console.error(error);
			     Code.expect(error).to.be.undefined();
			     done();
		     });
	});

	lab.test("Test find method", (done) => {
		const {email} = USER_REPO;
		userRepo.find({email}, 1, 0)
		        .then((result) => {
		            verifyUserData(result, done);
		        })
		        .catch((error) => {
			        console.error(error);
			        Code.expect(error).to.be.undefined();
			        done();
		        });
	});

	lab.test("Test findById method", (done) => {
		userRepo.findById(USER_REPO._id)
		        .then((result) => {
			        verifyUserData(result, done);
		        })
		        .catch((error) => {
			        console.error(error);
			        Code.expect(error).to.be.undefined();
			        done();
		        });
	});

	lab.test("Test findByIdAndUpdate method", (done) => {
		USER_REPO.firstName = 'Jane';
		USER_REPO.lastName = 'D';

		userRepo.findByIdAndUpdate(USER_REPO._id, USER_REPO)
		        .then((result) => {
			        verifyUserData(result, done);
		        })
		        .catch((error) => {
			        console.error(error);
			        Code.expect(error).to.be.undefined();
			        done();
		        });
	});

	lab.test("Test findByIdAndDelete method", (done) => {
		userRepo.findByIdAndDelete(USER_REPO._id)
		        .then((result) => {
			        Code.expect(result).to.have.length(0);
			        done();
		        })
		        .catch((error) => {
			        console.error(error);
			        Code.expect(error).to.be.undefined();
			        done();
		        });
	});
});

/**
 * Create User Test
 * Test for all adverse scenarios while creating a new user
 */
lab.experiment("\n\n\n***** User API Tests *****\n", () => {

	lab.test("Create a user with no password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('password');
			done();
		});
	});

	lab.test("Create a user with no first name", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				lastName : USER_MODEL.LASTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('firstName');
			done();
		});
	});

	lab.test("Create a user with no last name", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				firstName: USER_MODEL.FIRSTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('lastName');
			done();
		});
	});

	lab.test("Create a user with no email address", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('email');
			done();
		});
	});

	lab.test("Create a user with invalid email address", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : 'invalid-email',
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('email');
			done();
		});
	});

	lab.test("Create a user with invalid password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
				password : 'invalid'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('password');
			done();
		});
	});

	lab.test("Create a user successfully!!", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});

	lab.test("Create the same user twice", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				firstName: USER_MODEL.FIRSTNAME,
				lastName : USER_MODEL.LASTNAME,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.be.equal(ERROR_MSG.USR_ALREADY_EXIST);
			done();
		});
	});
});

/**
 * Login User Test
 * Test for all adverse scenarios while logging in as a user
 */
lab.experiment('User API: Login Test - ', () => {
	lab.test("with wrong email address", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.LOGIN.METHOD,
			url    : USER_API.LOGIN.URL,
			payload: {
				email    : 'anon@magicquill.in',
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.equal(ERROR_MSG.USR_DOESNT_EXIST);
			done();
		});
	});

	lab.test("with wrong password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.LOGIN.METHOD,
			url    : USER_API.LOGIN.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				password : 'incorrect-password'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.equal(ERROR_MSG.INCORRECT_PWD);
			done();
		});
	});

	lab.test("with no password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.LOGIN.METHOD,
			url    : USER_API.LOGIN.URL,
			payload: {
				email: USER_MODEL.EMAIL,
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('password');
			done();
		});
	});

	lab.test("with no email address", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.LOGIN.METHOD,
			url    : USER_API.LOGIN.URL,
			payload: {
				password: USER_MODEL.PASSWORD,
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('email');
			done();
		});
	});

	lab.test("As a valid student", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.LOGIN.METHOD,
			url    : USER_API.LOGIN.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			USER_MODEL.TOKEN = result.token;

			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.equal(STATUS.SUCCESSFUL);
			Code.expect(result.token).to.be.a.string();
			Code.expect(result.userRole).to.equal(USERROLES.STUDENT);
			done();
		});
	});
});
/**
 * Update User Test
 * Test for all adverse scenarios while updating user
 */
lab.experiment('User API: Update User Test - ', () => {

	lab.test('valid old password, but invalid new password', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				oldPassword: USER_MODEL.PASSWORD,
				newPassword: 'invalid'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('newPassword');
			done();
		});
	});

	lab.test('invalid old password, but valid new password', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				oldPassword: 'incorrect-password',
				newPassword: 'new-password-test'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.be.equal(ERROR_MSG.INCORRECT_PWD);
			done();
		});
	});

	lab.test('Update without authorisation token', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			payload: {
				oldPassword: USER_MODEL.PASSWORD,
				newPassword: 'new-password-test',
				firstName  : 'new first name',
				firstLast  : 'new last name',
				email      : 'mystery@magicquill.in'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(401);
			Code.expect(result.error).to.be.equal(STATUS.UNAUTHORIZED);
			done();
		});
	});

	lab.test('Successfully update password!!', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				oldPassword: USER_MODEL.PASSWORD,
				newPassword: 'new-password-test'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});

	lab.test('Successfully update password again!!', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				oldPassword: 'new-password-test',
				newPassword: USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});

	lab.test('Update firstName only', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				firstName: 'Jane'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});
	lab.test('Update lastName only', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				lastName: 'Smith'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});

	lab.test('Update with invalid email', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email: 'invalid-email'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.keys).to.include('email');
			done();
		});
	});

	lab.test('Update email only', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email: 'mystery@magicquill.in'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});

	lab.test('Update email again!!', (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.UPDATE.METHOD,
			url    : USER_API.UPDATE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email: USER_MODEL.EMAIL
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.be.equal(STATUS.SUCCESSFUL);
			done();
		});
	});
});

/**
 * Delete User Test
 * Test for all adverse scenarios while deleting user
 */
lab.experiment('User API: Delete User Test - ', () => {

	lab.test("Delete user without auth token", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.DELETE.METHOD,
			url    : USER_API.DELETE.URL,
			payload: {
				email    : USER_MODEL.EMAIL,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;

			Code.expect(response.statusCode).to.equal(401);
			Code.expect(result.error).to.equal(STATUS.UNAUTHORIZED);
			done();
		});
	});

	lab.test("Delete user with wrong password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.DELETE.METHOD,
			url    : USER_API.DELETE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email    : USER_MODEL.EMAIL,
				password : 'invalid-password'
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.equal(ERROR_MSG.INCORRECT_PWD);
			done();
		});
	});

	lab.test("Delete user with incorrect email address", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.DELETE.METHOD,
			url    : USER_API.DELETE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email    : 'mystery@magicquill.in',
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.message).to.equal(ERROR_MSG.USR_DOESNT_EXIST);
			done();
		});
	});

	lab.test("Successfully delete a user", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.DELETE.METHOD,
			url    : USER_API.DELETE.URL,
			headers: {
				'Authorization': USER_MODEL.TOKEN
			},
			payload: {
				email    : USER_MODEL.EMAIL,
				password : USER_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;

			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.equal(STATUS.SUCCESSFUL);
			done();
		});
	});
});
