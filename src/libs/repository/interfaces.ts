export interface IEntity {
    _id: string;
    createdDate: string;
    updatedAt: string;
}

export interface IRepository<T extends IEntity> {
    findById(id: string): Promise<T>;
    findByIdAndDelete(id: string): Promise<T>;
    findByIdAndUpdate(id: string, entity: T): Promise<T>;
    find(filter: Object, top?: number, skip?: number): Promise<Array<T>>;
    create(entity: T): Promise<T>;
}

export interface INeo4j {
	cypher(options: {
		query: string;
		params?: {};
	}, callback: Function);
}

export interface IUser extends IEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    userRole: string;
	lastLogin: string;
};

export interface IUserRepository extends IRepository<IUser> {};
