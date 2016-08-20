/// <reference path="../typings.d.ts" />
import {IPlugin} from "./libs/plugins/interfaces";
import Configurations from "./configs/configurations";
import * as Hapi from "hapi";
import * as fs from 'fs';
import * as Path from 'path';
import Routes from "./routes";


export class MagicQuill {
	private server: Hapi.Server;
	constructor(){
		const port   = process.env.port || Configurations.Server.port;
		this.server = new Hapi.Server();

		this.server.connection({
			port: port,
			routes: {
				files: {
					relativeTo: Path.join(__dirname, 'public/')
				}
			}
		});

		this.loadPlugins();

		Routes(this.server);
	}

	public start() {
		this.server.start(() => {
			console.log('Server running at:', this.server.info.uri);
		});;

		return this.server;
	}

	private loadPlugins(){
		const pluginsPath = __dirname + '/libs/plugins/';
		const plugins     = fs.readdirSync(pluginsPath).filter(file => fs.statSync(Path.join(pluginsPath, file)).isDirectory());

		plugins.forEach((pluginName: string) => {
			var plugin: IPlugin = (require("./libs/plugins/" + pluginName)).default();
			console.log(`Loading Module: ${plugin.info().name} v${plugin.info().version}`);
			plugin.register(this.server);
		});
	}
}

