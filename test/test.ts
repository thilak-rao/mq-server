/// <reference path="../typings/index.d.ts" />
import {IServerInjectResponse, IServerInjectOptions} from "hapi";
import server from "../src/server";
var Code = require('code');   // assertion library
var Lab  = require('lab');
var lab  = exports.lab = Lab.script();
var _ = require('lodash');


lab.experiment("User API Test", function() {

	const createUserOptions: IServerInjectOptions = {
		method : "POST",
		url    : "/api/user/",
		payload: {
			email    : 'test@magicquill.in',
			firstName: 'John',
			lastName : 'Doe',
			password : 'supersecret'
		}
	};

	lab.test("Create a user with no password", (done) => {
		let options = _.assign(createUserOptions);
		delete options.payload['password'];

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user with no first name", (done) => {
		let options = _.assign(createUserOptions);
		delete options.payload['firstName'];

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user with no last name", (done) => {
		let options = _.assign(createUserOptions);
		delete options.payload['lastName'];

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user with no email address", (done) => {
		let options = _.assign(createUserOptions);
		delete options.payload['email'];

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user with invalid email address", (done) => {
		let options = _.assign(createUserOptions);
		options.payload['email'] = 'invalid-email';

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user with invalid password", (done) => {
		let options = _.assign(createUserOptions);
		options.payload['password'] = '1234';

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});

	lab.test("Create a user successfully!!", (done) => {
		let options = _.assign(createUserOptions);

		server.inject(options, (response: IServerInjectResponse) => {
			const result: any = response.result;
			Code.expect(response.statusCode).to.equal(400);
			Code.expect(result.validation.source).to.include('payload');
			done();
		});
	});



	// we expect this test to return 400 (validation error)
	// lab.test("creating valid user", function(done) {
	// 	var options = {
	// 		method: "GET",
	// 		url: "/T"
	// 	};
	//
	// 	server.inject(options, function(response) {
	// 		Code.expect(response.statusCode).to.equal(400);
	// 		// Code.expect(response.result.message).to.equal('yourname length must be at least 2 characters long');
	// 		done();
	// 	});
	// });
});

// lab.experiment("Authentication Required to View Photo", function() {
// 	// tests
// 	lab.test("Deny view of photo if unauthenticated /photo/{id*} ", function(done) {
// 		var options = {
// 			method: "GET",
// 			url: "/photo/8795"
// 		};
// 		// server.inject lets you similate an http request
// 		server.inject(options, function(response) {
// 			Code.expect(response.statusCode).to.equal(401);  //  Expect http response status code to be 200 ("Ok")
// 			Code.expect(response.result.message).to.equal("Please log-in to see that"); // (Don't hard-code error messages)
// 			done();
// 		});
// 	});
// });