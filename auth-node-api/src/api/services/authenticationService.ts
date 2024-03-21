import { createUser, getUserByEmail, updateUser,updateOne,getPasswordByUserEmail,getSessionTokenByUserEmail,getCredentials} from "../../db/UsersDb";
import { ResponseDto } from "../models/ResponseDtoI";
import { generateRadomSalt, hashPassword,verifyPassword, generateToken,isTokenExpired } from "../../helpers/TokenHelper"


async function serviceRegister(email: string, password: string, username: string): Promise<ResponseDto>{
    
    if (!username || !email || !password) {
        let responseDto : ResponseDto = {
            status: '400',
            error: true,
            message: 'Missing data [username, email, password]'
        }
        return responseDto;
    }

    const userWithEmail = await getUserByEmail(email);

    if(userWithEmail){
        let responseDto : ResponseDto = {
            status: '409',
            error: true,
            message: 'User with this email already exist'
        }
        return responseDto;
    }

    const salt = generateRadomSalt(email);

    const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password: await hashPassword(password),
                sessionToken: generateToken({email, salt})
            }

        });

        let response: ResponseDto ={
            status: '201',
            error: false,
            message: 'User Created with SUCESS'
        }

        return response
}


async function login( email: string, password: string){
    let messageTokenInvlid = '';

    if(!password || !email){
        let responseDto : ResponseDto = {
            status: '400',
            error: true,
            message: 'Missing data [ email, password]'
        }
        return responseDto;
    }

    let userWithCrendentials = await getUserWithCredentials(email);

    if(!userWithCrendentials || !userWithCrendentials.authentication){
        let responseDto : ResponseDto = {
            status: '500',
            error: true,
            message: 'No user with this email found'
        }
        return responseDto;
    };
    

    if (!userWithCrendentials || !userWithCrendentials.authentication) {
        let responseDto: ResponseDto = {
            status: '403',
            error: true,
            message: 'Invalid password'
        }
        return responseDto;
    }

    const passwordValid = await verifyPassword(password, userWithCrendentials.authentication.password!);

    if (!passwordValid) {
        let responseDto: ResponseDto = {
            status: '403',
            error: true,
            message: 'Invalid password'
        }
        return responseDto;
    };


    const token = await getSessionTokenByUserEmail(email).then((user: any) => user.authentication.sessionToken);
    const isValid = isTokenExpired(token);


    if (!isValid) {
        let newSessionToken = generateToken({ email, salt: userWithCrendentials.authentication!.salt });
        const value = await updateSessionToken(email, newSessionToken);
        messageTokenInvlid = 'Token expired, new token generated';
    }

    let responseDto: ResponseDto = {
        status: '200',
        error: false,
        message: messageTokenInvlid,
        token: token
    }
    return responseDto;

    
    


}

async function updateSessionToken(email:string, newSessionToken:string) {
    try {
      // Encontra o usuário pelo e-mail e atualiza o sessionToken diretamente
      const result = await updateOne(
        { email: email },
        { $set: { "authentication.sessionToken": newSessionToken } }
      );
  
      // Verifica se a atualização foi bem-sucedida
      if (result.modifiedCount === 1) {
        console.log('SessionToken atualizado com sucesso.');
      } else {
        console.log('Não foi possível atualizar o SessionToken.');
      }
  
      return result;
    } catch (error) {
      console.error('Erro ao atualizar o SessionToken:', error);
      throw error;
    }
}

async function getUserWithCredentials(email: string) {
    try {
      const authentication = await getCredentials(email);
      return authentication;
    } catch (error) {
      console.error('Erro ao buscar credenciais:', error);
      throw error;
    }
  }

module.exports = {
    serviceRegister,
    login
}