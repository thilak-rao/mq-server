export interface IEntity {
    _id: string;
    createdDate: Date;
    updatedAt: Date;
}

export interface IRepository<T extends IEntity> {
    findById(id: string): Promise<T>;
    findByIdAndDelete(id: string): Promise<T>;
    findByIdAndUpdate(id: string, entity: T): Promise<T>;
    find(filter: Object, top?: number, skip?: number): Promise<Array<T>>;
    create(entity: T): Promise<T>;
};

export interface IUser extends IEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    userRole: string;
	lastLogin: Date;
};

export interface IUserRepository extends IRepository<IUser> {};
