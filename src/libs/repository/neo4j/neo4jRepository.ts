import {IEntity, IRepository, INeo4j} from "../interfaces";
import {NEO4J} from "../../../configs/environment";

const UUID  = require("node-uuid");
const neo4j = require('neo4j');

abstract class Neo4jRepository<T extends IEntity> implements IRepository<IEntity>  {
	protected db: INeo4j;

	constructor() {
		const url = `${NEO4J.protocol}${NEO4J.username}:${NEO4J.password}@${NEO4J.host}:${NEO4J.port}`;
		this.db = new neo4j.GraphDatabase(url);
	}

	protected nodeName: string;

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
				query.push(`${variable}.${key}='${entity[key]}'`);
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
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `CREATE (n:${this.nodeName} {${this.stringifyEntity(entity)}}) RETURN n`,
				params: entity
			}, (error, results) => {
				if (error) {
					reject(error);
				}

				resolve(results);
			});
		});
	}

	public find(filter: T, top?: number, skip?: number): Promise<Array<T>> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName} {${this.stringifyEntity(filter)}}) RETURN n LIMIT ${top}`,
				params: filter
			}, (error, results) => {
				if (error) {
					reject(error);
				}

				resolve(this.formatProperties(results));
			});
		});
	}

	public findById(id: string): Promise<T> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') RETURN n`,
			}, (error, results) => {
				if (error) {
					reject(error);
				}

				resolve(this.formatProperties(results));
			});
		});
	}

	public findByIdAndUpdate(id: string, entity: T): Promise<any> {
        entity.updatedAt = new Date();
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') SET ${this.updateEntity(entity, 'n')} RETURN n`,
			}, (error, results) => {
				if (error) {
					reject(error);
				}

				resolve(this.formatProperties(results));
			});
		});
	}

	public findByIdAndDelete(id: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.cypher({
				query: `MATCH (n:${this.nodeName}) WHERE (n._id = '${id}') DELETE n`,
			}, (error, results) => {
				if (error) {
					reject(error);
				}

				resolve(this.formatProperties(results));
			});
		});
	}
}

export default Neo4jRepository;
