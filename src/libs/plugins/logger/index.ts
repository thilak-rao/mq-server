import {IPlugin} from '../interfaces'
import * as Hapi from 'hapi'
const Good = require('good');
const GoodConsole = require('good-console');

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server) => {
            const opts = {
                ops: {
                    interval: 1000,
                },
                reporters: {
                    consoleReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ log: '*', response: '*', 'error': '*', request: '*' }]
                    }, {
                        module: 'good-console'
                    }, 'stdout'],
                    fileReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ log: '*', response: '*', 'error': '*', request: '*' }]
                    }, {
                        module: 'good-squeeze',
                        name: 'SafeJson'
                    }, {
                        module: 'good-file',
                        args: ['./log/server.log']
                    }]
                }
            };

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
    }
};