import {IPlugin} from '../interfaces';
import * as Hapi from 'hapi';
const Path  = require('path');
const Inert = require('inert');

export default (): IPlugin => {
	return {
		register: (server: Hapi.Server) => {
			const opts = {
			};

			server.register({
				register: Inert,
				options: opts
			}, (error) => {
				if (error) {
					console.log('error', error);
				}
			});
		},
		info: () => {
			return {
				name: "Inert",
				version: "4.0.1"
			};
		}
	}
};