import * as Hapi from "hapi";
import UserController from '../controllers/user.controller';
import UserRepository from '../libs/repository/neo4j/user.repository';
import {USER_API} from "../configs/constants";

export default function(server: Hapi.Server) {
	// User API Routes
	const userController = new UserController(server, new UserRepository());

	server.route({
		method: USER_API.CREATE.METHOD,
		path: USER_API.CREATE.URL,
		handler: undefined,
		config: userController.createUser()
	});

	server.route({
		method: USER_API.LOGIN.METHOD,
		path: USER_API.LOGIN.URL,
		handler: undefined,
		config: userController.authenticateUser()
	});


	server.route({
		method: USER_API.DELETE.METHOD,
		path: USER_API.DELETE.URL,
		handler: undefined,
		config: userController.deleteUser()
	});

	server.route({
		method: USER_API.UPDATE.METHOD,
		path: USER_API.UPDATE.URL,
		handler: undefined,
		config: userController.updateUser()
	});


    // Serve Static Files for the SPA app.
    server.route({
        method: 'GET',
        path: '/{path*}',
	    handler: {
		    directory: {
			    path   : '.',
			    listing: true
		    }
	    }
    });
}
