import { createUser, getUserByEmail } from "../../db/UsersDb";
import { ResponseDto } from "../models/ResponseDtoI";
import { generateRadomSalt, hashPassword } from "../../helpers/TokenHelper"


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
                password: await hashPassword(password)
            }

        });

        let response: ResponseDto ={
            status: '201',
            error: false,
            message: 'User Created with SUCESS'
        }

        return response
}


module.exports = {
    serviceRegister
}