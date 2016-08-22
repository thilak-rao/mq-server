import {IPlugin} from '../interfaces';
import * as Hapi from 'hapi';
import {ISDEBUG} from "../../../configs/environment";
const Good = require('good');

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server) => {
	        const fileReporter = [{
		        module: 'good-squeeze',
		        name  : 'Squeeze',
		        args  : [{log: '*', response: '*', 'error': '*', request: '*'}]
	        }, {
		        module: 'good-squeeze',
		        name  : 'SafeJson'
	        }, {
		        module: 'good-file',
		        args  : ['./log/server.log']
	        }];

	        const consoleReporter = [{
		        module: 'good-squeeze',
		        name  : 'Squeeze',
		        args  : [{log: '*', response: '*', 'error': '*', request: '*'}]
	        }, {
		        module: 'good-console'
	        }, 'stdout'];

	        let opts = {
		        ops: { interval: 1000 },
		        reporters: null
	        };

	        if (ISDEBUG) {
		        opts.reporters = {consoleReporter};
	        } else {
		        opts.reporters = {fileReporter};
	        }

            server.register({
                register: Good,
                options: opts
            }, (error) => {
                if (error) {
                    console.log('error', error);
                }
            });
        },
        info: () => {
            return {
                name: "Good Logger",
                version: "7.0.1"
            };
        }
    };
};
