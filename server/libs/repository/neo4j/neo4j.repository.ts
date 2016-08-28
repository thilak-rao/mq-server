import {IEntity, IRepository, INeo4j} from "../interfaces";
import {NEO4J} from "../../../configs/environment";

const neo4j  = require('neo4j'),
      UUID   = require("node-uuid"),
      moment = require('moment');

abstract class Neo4jRepository<T extends IEntity> implements IRepository<IEntity>  {
	protected db: INeo4j;

	protected nodeName: string;

	constructor() {
		const url = `${NEO4J.protocol}${NEO4J.username}:${NEO4J.password}@${NEO4J.host}:${NEO4J.port}`;
		this.db = new neo4j.GraphDatabase(url);
	}

	protected stringifyEntity(entity: T): string {
		let query: Array<string> = [];

		for (const key in entity) {
			if (entity.hasOwnProperty(key)) {
				query.push(`${key}: {${key}}`);
			}
		}
		return query.join(', ');
	}

	protected updateEntity(entity: T, variable: string): string {
		let query: Array<string> = [];

		for (const key in entity) {
			if (entity.hasOwnProperty(key)) {
				if (typeof entity[key] === 'boolean') {
					query.push(`${variable}.${key}=${entity[key]}`);
				} else {
					query.push(`${variable}.${key}='${entity[key]}'`);
				}
			}
		}
		return query.join(', ');
	}

	protected formatProperties(result: Array<T>): Array<T> {
		return result.map((value) => {
			return value['n']['properties'];
		});
	}

	public create(entity: T): Promise<any> {
		entity._id = UUID.v4();
		entity.createdDate = moment().toJSON();
		entity.updatedAt = moment().toJSON();
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `CREATE (n:${this.nodeName} {${this.stringifyEntity(entity)}}) RETURN n`,
				params: entity
			}, (error, results) => {
				if (error !== null || typeof results === 'undefined') {
					return reject(`Could not create ${this.nodeName} - id: ${entity._id}`);
				}

				return resolve(this.formatProperties(results));
			});
		});
	}

	public find(filter: any, top?: number, skip?: number): Promise<Array<T>> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName} {${this.stringifyEntity(filter)}}) RETURN n LIMIT ${top}`,
				params: filter
			}, (error, results) => {
				if (error !== null || typeof results === 'undefined') {
					return reject(`Could not find ${this.nodeName} with filter ${JSON.stringify(filter)}`);
				}

				return resolve(this.formatProperties(results));
			});
		});
	}

	public findById(id: string): Promise<T> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') RETURN n`,
			}, (error, results) => {
				if (error !== null || typeof results === 'undefined') {
					return reject(`Could not find ${this.nodeName} by id ${id}`);
				}

				return resolve(this.formatProperties(results));
			});
		});
	}

	public findByIdAndUpdate(id: string, entity: any): Promise<any> {
        entity.updatedAt = moment().toJSON();
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') SET ${this.updateEntity(entity, 'n')} RETURN n`,
			}, (error, results) => {
				if (error !== null || typeof results === 'undefined') {
					return reject(`Could not find ${this.nodeName} and update by id ${id}`);
				}

				return resolve(this.formatProperties(results));
			});
		});
	}

	public findByIdAndDelete(id: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') DELETE n`,
			}, (error, results) => {
				if (error !== null || typeof results === 'undefined') {
					return reject(`Could not find ${this.nodeName} and delete by id ${id}`);
				}

				return resolve(results);
			});
		});
	}
}

export default Neo4jRepository;
