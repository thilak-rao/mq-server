import {IRepositoryConfig, IServerConfig} from "./interfaces";
export const JWTSECRET: string = 'secretkey';
export const ISDEBUG: boolean  = true;

export const NEO4J: IRepositoryConfig = {
	username: process.env.Neo4jUser,
	password: process.env.Neo4jPwd,
	host    : 'localhost',
	port    : 7474,
	protocol: 'http://'
};

export const SERVER: IServerConfig = {
	port: 3000
};

export const AWS_CONFIG = {
	region : 'ap-south-1', // Mumbai Region
	secretkey: process.env.AWSSecretKey,
	accesskey: process.env.AWSAccessKeyId,
	urlExpiry: (60 * 60) * 12 // 60 seconds x 60 minutes x 12 hours.
};
