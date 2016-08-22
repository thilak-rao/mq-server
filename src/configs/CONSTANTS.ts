export const USER_API = {
	CREATE: {
		URL   : '/api/user/',
		METHOD: 'POST'
	},
	UPDATE: {
		URL   : '/api/user/',
		METHOD: 'PUT'
	},
	LOGIN : {
		URL   : '/api/login/',
		METHOD: 'POST'
	},
	DELETE: {
		URL   : '/api/user/',
		METHOD: 'DELETE'
	},
};

export const USERROLES = {
	STUDENT : 'student',
	LECTURER: 'lecturer',
	ADMIN   : 'admin'
};

export const STATUS = {
	SUCCESSFUL : 'Successful',
	UNAUTHORIZED: 'Unauthorized'
};

export const ERROR_MSG = {
	USR_DOESNT_EXIST : 'User account doesn\'t exist',
	INCORRECT_PWD    : 'Incorrect Password',
	USR_ALREADY_EXIST: 'User already exists'
};
