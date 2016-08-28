/// <reference path="../typings.d.ts" />
import {IPlugin} from "./libs/plugins/interfaces";
import * as Hapi from "hapi";
import {Server} from "hapi";
import Routes from "./routes";
import {SERVER} from "./configs/environment";

const server: Server = new Hapi.Server();

const port = process.env.port || SERVER.port,
      fs   = require('fs'),
      Path = require('path');

server.connection({
	port: port,
	routes: {
		files: {
			relativeTo: Path.join(__dirname, 'public/')
		}
	}
});

//  Setup Hapi Plugins
const pluginsPath = __dirname + '/libs/plugins/';
const plugins     = fs.readdirSync(pluginsPath).filter(file => fs.statSync(Path.join(pluginsPath, file)).isDirectory());

plugins.forEach((pluginName: string) => {
	var plugin: IPlugin = (require("./libs/plugins/" + pluginName)).default();
	console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
	plugin.register(server);
});

//Register Routes
Routes(server);

server.start(() => {
	console.log('Server running at:', server.info.uri);
});

export default server;
