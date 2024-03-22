import { ResponseDto } from "../models/response.dto";
import { InformationDao } from "../../api/models/information.dao";
import IUserRepository from "../../domain/repositories/user.repository";
import TokenService from "./token.service";
import { AuthenticationDetailsDao } from "../../api/models/authenticationDetails";
import { isAuthenticationDetailsDao } from "../../api/models/authenticationDetails";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import {AuthServiceI} from "../services/auth.serviceI";


@injectable()
export default class AuthServiceImpl implements AuthServiceI{


    constructor(
        @inject(Types.IUserRepository)
        private userRepository: IUserRepository,
        @inject(Types.TokenService)
        private tokenService: TokenService
    ) {}


    async serviceRegister(email: string, password: string, username: string): Promise<ResponseDto>{
    
        if (!username || !email || !password) {
            let responseDto : ResponseDto = {
                status: '400',
                error: true,
                message: 'Missing data [username, email, password]'
            }
            return responseDto;
        }
    
        const userWithEmail = await this.userRepository.getUserByEmail(email);
    
        if(userWithEmail){
            let responseDto : ResponseDto = {
                status: '409',
                error: true,
                message: 'User with this email already exist'
            }
            return responseDto;
        }
    
        const salt = this.tokenService.generateRadomSalt(email);
    
        const user = await this.userRepository.createUser({
                email,
                username,
                authentication:{
                    salt,
                    password: await this.tokenService.hashPassword(password),
                    sessionToken: this.tokenService.generateToken({email, salt})
                }
    
            });
    
            let response: ResponseDto ={
                status: '201',
                error: false,
                message: 'User Created with SUCESS'
            }
    
            return response
    }
    
    
    async login( email: string, password: string){
    
        if(!password || !email){
            let responseDto : ResponseDto = {
                status: '400',
                error: true,
                message: 'Missing data [ email, password]'
            }
            return responseDto;
        }
    
        let userWithCrendentials = await this.getUserWithCredentials(email);
    
        if(!userWithCrendentials || !userWithCrendentials.authentication){
            let responseDto : ResponseDto = {
                status: '500',
                error: true,
                message: 'No user with this email found'
            }
            return responseDto;
        };
        
    
        const passwordValid = await this.tokenService.verifyPassword(password, userWithCrendentials.authentication.password!);
    
        if (!passwordValid) {
            let responseDto: ResponseDto = {
                status: '403',
                error: true,
                message: 'Invalid password'
            }
            return responseDto;
        };
    
    
        const token = userWithCrendentials.authentication.sessionToken!;
        const verificationReturn = await this.verifyTokenInformation(email, token, userWithCrendentials.authentication.salt!);
    
        if(!verificationReturn.success){
            let responseDto: ResponseDto = {
                status: '403',
                error: true,
                message: verificationReturn.information,
                token: ''
            }
            return responseDto;
        }
    
        let responseDto: ResponseDto = {
            status: '200',
            error: false,
            message:  verificationReturn.information,
            token: token
        }
        return responseDto;
    
        
        
    
    
    }
    async  getUser(){
        return {
            status: '200',
            error: false,
            message: 'User found'
        }
    
    }
    
    async verifyTokenInformation(email:string, token:string, salt:string): Promise<InformationDao>{
        try {
            const isValid = await this.tokenService.verifyToken(token);
            
        
         
            if (typeof isValid !== 'string') {
                let newSessionToken = this.tokenService.generateToken({ email,salt })
                const result = await this.userRepository.updateOne(
                    { email: email },
                    { $set: { "authentication.sessionToken": newSessionToken } }
                  );
              
                  // Verifica se a atualização foi bem-sucedida
                  if (result) {
                    console.log('SessionToken atualizado com sucesso.');
                    const dao : InformationDao = {success: true, information:'SessionToken atualizado com sucesso.'}
                    return dao
                  } else {
                    console.log('Não foi possível atualizar o SessionToken.');
                    const daoError : InformationDao = {success: false, information:'Não foi possível atualizar o SessionToken.'}
                    return daoError
                  }
            }
    
            const dao : InformationDao = {success: true, information:''}
            return dao
    
          
        } catch (error:any) {
          console.error('Erro ao atualizar o SessionToken:', error);
    
          const dao : InformationDao = {success: true, information: error.message || 'Erro ao atualizar o SessionToken.'}
          return dao
        }
    }
    
    async getUserWithCredentials(email: string):Promise<AuthenticationDetailsDao | null> {

        const authentication = await this.userRepository.getCredentials(email);

        if (isAuthenticationDetailsDao(authentication)) {
            return authentication;
        }
    
        return null;

    }
    

}




