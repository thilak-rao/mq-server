import * as Hapi from "hapi";
import TaskController from '../controllers/taskController';
import UserController from '../controllers/user.controller';
import TaskRepository from '../libs/repository/mongo/taskRepository';
import UserRepository from '../libs/repository/mongo/userRepository';

export default function(server: Hapi.Server) {

    const taskController = new TaskController(server, new TaskRepository());

    server.route({
        method: 'GET',
        path: '/api/tasks/{id}',
        handler: undefined,
        config: taskController.getTaskById()
    });

    server.route({
        method: 'GET',
        path: '/api/tasks',
        handler: undefined,
        config: taskController.getTasks()
    });

    server.route({
        method: 'DELETE',
        path: '/api/tasks/{id}',
        handler: undefined,
        config: taskController.deleteTask()
    });

    server.route({
        method: 'PUT',
        path: '/api/tasks/{id}',
        handler: undefined,
        config: taskController.updateTask()
    });

    server.route({
        method: 'POST',
        path: '/api/tasks',
        handler: undefined,
        config: taskController.createTask()
    });


	// Signup Route
	const userController = new UserController(server, new UserRepository());

	server.route({
		method: 'POST',
		path: '/api/user',
		handler: undefined,
		config: userController.createUser()
	});

	server.route({
		method: 'POST',
		path: '/api/login',
		handler: undefined,
		config: userController.authenticateUser()
	});


	server.route({
		method: 'DELETE',
		path: '/api/user',
		handler: undefined,
		config: userController.deleteUser()
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