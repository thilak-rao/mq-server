import {IRepositoryConfig, IServerConfig} from "./interfaces";
export const JWTSECRET :string = 'secretkey';
export const ISDEBUG :boolean = true;

export const NEO4J: IRepositoryConfig = {
	username: 'neo4j',
	password: 'supersecret',
	host: 'localhost',
	port: 7474,
	protocol: 'http://'
};

export const SERVER: IServerConfig = {
	port: 3000
};
