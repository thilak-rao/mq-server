import {IPlugin} from '../interfaces';
import * as Hapi from 'hapi';
const authJWT2 = require('hapi-auth-jwt2');
import {JWTSECRET} from "../../../configs/environment";

export default (): IPlugin => {
	return {
		register: (server: Hapi.Server) => {
			const opts = {
			};

			server.register({
				register: authJWT2,
				options: opts
			}, (error) => {
				if (error) {
					console.log('error', error);
				}

				server.auth.strategy('jwt', 'jwt', false, {
					key: JWTSECRET,
					validateFunc: (decoded, request, callback) => {
						// returning true because user.controller.ts will check
						// if the credentials are valid
						return callback(null, true);
					},
					verifyOptions: { algorithms: [ 'HS256' ] }
				});

				server.auth.default('jwt');
			});
		},
		info: () => {
			return {
				name: "Hapi Auth JWT2",
				version: "7.0.1"
			};
		}
	};
};
