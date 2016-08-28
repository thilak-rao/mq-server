import {IUser} from "../interfaces";
import Neo4jRepository from "./neo4j.repository";

class UserRepository extends Neo4jRepository<IUser>  {
	constructor() {
		super();
	}

	protected nodeName: string = 'User';
}


export default UserRepository;
