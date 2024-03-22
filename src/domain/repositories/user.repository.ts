import { InformationDao } from "../../api/models/information.dao";
import { UserEntity } from "../../domain/entites/user.entity";

export default  interface IUserRepository {
    getUsers(): Promise<UserEntity[]>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    createUser(values: Record<string, any>): Promise<UserEntity>;
    updateUser(id: string, values: Record<string, any>): Promise<UserEntity | null>;
    deleteUserById(id: string): Promise<UserEntity | null>;
    updateOne(filter: Record<string, any>, values: Record<string, any>): Promise<boolean>;
    getCredentials(email: string): Promise<Pick<UserEntity, 'authentication'>| InformationDao>;
}