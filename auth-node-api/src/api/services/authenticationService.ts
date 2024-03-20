import { createUser, getUserByEmail, updateUser,updateOne, findOne} from "../../db/UsersDb";
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

    let userWithCrendentials = await getUserByEmail(email);

    if(!userWithCrendentials || !userWithCrendentials.authentication){
        let responseDto : ResponseDto = {
            status: '500',
            error: true,
            message: 'No user with this email found'
        }
        return responseDto;
    };
    
    const passwordFromDb = findUserByEmail(email).then((user) => user!.authentication!.password);
    console.log(passwordFromDb);    


    const passwordValid = await verifyPassword(password, passwordFromDb);
    const token = userWithCrendentials.authentication!.sessionToken?.toString() || '';
    const isValid = isTokenExpired(token);

    if(!passwordValid){
        let responseDto : ResponseDto = {
            status: '403',
            error: true,
            message: 'Invalid password'
        }
        return responseDto;
    };

    if (!isValid) {
        let newSessionToken = generateToken({ email, salt: userWithCrendentials.authentication!.salt });
        const value = await updateSessionToken(email, newSessionToken);
        messageTokenInvlid = 'Token expired, new token generated';
    }

    let responseDto: ResponseDto = {
        status: '200',
        error: false,
        message: messageTokenInvlid,
        token: userWithCrendentials!.authentication!.sessionToken!.toString()
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
export async function findUserByEmail(email: string): Promise<any | null> {
    try {
      // Find user by email, excluding the password field
      const user = await findOne({ email }).select('-authentication.password');
  
      // Return the user object (without password) or null if not found
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

module.exports = {
    serviceRegister,
    login
}