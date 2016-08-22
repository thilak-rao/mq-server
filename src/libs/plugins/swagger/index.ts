import {IPlugin, IPluginInfo} from '../interfaces';
import * as Hapi from 'hapi';
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server) => {
            server.register([
                Vision,
                {
                    register: HapiSwagger,
                    options: {
                        info: {
	                        title      : 'MagicQuill',
	                        description: 'API documentation to access MagicQuill REST services',
	                        version    : '0.1'
                        },
                        securityDefinitions: {
                          'jwt': {
	                          'type': 'apiKey',
	                          'name': 'Authorization',
	                          'in'  : 'header'
                          }
                        },
                        tags: [
                            {
                                'name': 'user',
                                'description': 'API to access MagicQuill User Resources'
                            }
                        ],
                        enableDocumentation: true,
                        documentationPath: '/documentation'
                    }
                }
            ], (error) => {
                if (error) {
                    console.log('error', error);
                }
            });
        },
        info: () => {
            return {
                name: "Swagger Documentation",
                version: "6.2.2"
            };
        }
    };
};
