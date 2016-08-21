/// <reference path="../typings/index.d.ts" />
import {IServerInjectResponse, IServerInjectOptions} from "hapi";
import server from "../src/server";
import {STATUS, USER_API, USERROLES, ERROR_MSG} from "../src/configs/CONSTANTS";

const Code = require('code'),
      Lab  = require('lab'),
      lab  = exports.lab = Lab.script();


/**
 * Variables required to test user api
 */
const USR_MODEL = {
	EMAIL    : 'test@magicquill.in',
	FIRSTNAME: 'John',
	LASTNAME : 'Doe',
	PASSWORD : 'supersecret',
	TOKEN    : ''
};


/**
 * Create User Test
 * Test for all adverse scenarios while creating a new user
 */
lab.experiment("User API: Create New User - ", () => {

	lab.test("Create a user with no password", (done) => {
		const options: IServerInjectOptions = {
			method : USER_API.CREATE.METHOD,
			url    : USER_API.CREATE.URL,
			payload: {
				email    : USR_MODEL.EMAIL,
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
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
				email    : USR_MODEL.EMAIL,
				lastName : USR_MODEL.LASTNAME,
				password : USR_MODEL.PASSWORD
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
				email    : USR_MODEL.EMAIL,
				firstName: USR_MODEL.FIRSTNAME,
				password : USR_MODEL.PASSWORD
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
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
				password : USR_MODEL.PASSWORD
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
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
				password : USR_MODEL.PASSWORD
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
				email    : USR_MODEL.EMAIL,
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
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
				email    : USR_MODEL.EMAIL,
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
				password : USR_MODEL.PASSWORD
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
				email    : USR_MODEL.EMAIL,
				firstName: USR_MODEL.FIRSTNAME,
				lastName : USR_MODEL.LASTNAME,
				password : USR_MODEL.PASSWORD
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
				password : USR_MODEL.PASSWORD
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
				email    : USR_MODEL.EMAIL,
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
				email: USR_MODEL.EMAIL,
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
				password: USR_MODEL.PASSWORD,
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
				email    : USR_MODEL.EMAIL,
				password : USR_MODEL.PASSWORD
			}
		};

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			USR_MODEL.TOKEN = result.token;

			Code.expect(response.statusCode).to.equal(201);
			Code.expect(result.status).to.equal(STATUS.SUCCESSFUL);
			Code.expect(result.token).to.be.a.string();
			Code.expect(result.userRole).to.equal(USERROLES.STUDENT);
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
				email    : USR_MODEL.EMAIL,
				password : USR_MODEL.PASSWORD
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
				'Authorization': USR_MODEL.TOKEN
			},
			payload: {
				email    : USR_MODEL.EMAIL,
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
				'Authorization': USR_MODEL.TOKEN
			},
			payload: {
				email    : 'mystery@magicquill.in',
				password : USR_MODEL.PASSWORD
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
				'Authorization': USR_MODEL.TOKEN
			},
			payload: {
				email    : USR_MODEL.EMAIL,
				password : USR_MODEL.PASSWORD
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