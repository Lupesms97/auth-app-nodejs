import { UserEntity } from "../../domain/entites/user.entity";
import IUserRepository from "../../domain/repositories/user.repository"
import { injectable } from 'inversify'
import {UserModel} from '../models/user.models'
import { InformationDao } from "../../api/models/information.dao";
import { AuthenticationDetailsDao } from "../../api/models/authenticationDetails";



@injectable()
export default class UserRepositoryImpl implements IUserRepository{

    async getUsers(): Promise<UserEntity[]> {
        return UserModel.find()      
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return UserModel.findOne({email})
    }

    async createUser(values: Record<string, any>): Promise<UserEntity> {
        return new UserModel(values).save()
        .then((user) => user.toObject());
    }

    async updateUser(id: string, values: Record<string, any>): Promise<UserEntity | null> {
       return  UserModel.findByIdAndUpdate(id, values, {new: true})
    }

    async deleteUserById(id: string): Promise<UserEntity | null> {
        return UserModel.findByIdAndDelete({_id : id})
    }

    async updateOne(filter: Record<string, any>, values: Record<string, any>): Promise<boolean> {
        try {
            const result = await UserModel.updateOne(filter, values);
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating document:', error);
            return false;
        }
    }

    async  getCredentials(email: string): Promise<AuthenticationDetailsDao | InformationDao> {
        try {
            const user = await UserModel.findOne({ email }, 'authentication');
    
            if (!user) {
                const daoInfo: InformationDao = { success: false, information: 'User not found' };
                return daoInfo;
            }
    
            // Convertendo o usuário para o tipo UserEntity
            const userAsEntity = user.toObject() as UserEntity;

            const authenticationDetails: AuthenticationDetailsDao = {
                authentication: userAsEntity.authentication
            };
    
            // Retornando apenas a propriedade 'authentication'
            return authenticationDetails
        } catch (error:any) {
            const daoInfo: InformationDao = { success : false, information: error.message };
            return daoInfo
        }
    }

    async userExist(email: string): Promise<boolean> {
        try {
            const exist = await UserModel.exists({ email });
            return exist ? true : false;
        } catch (error) {
            console.error('Error checking if user exists:', error);
            return false;
        }
    }

}