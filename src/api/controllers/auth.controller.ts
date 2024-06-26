import { Types } from '../../di/types';
import { ResponseDto } from '../models/response.dto';
import AuthServiceI from '../services/auth.serviceI';
import express from 'express';
import { inject, injectable } from 'inversify'

@injectable()
export default class AuthController {
    constructor(
        @inject(Types.AuthServiceI) private authService: AuthServiceI
    ) {
        if (!this.authService) {
            throw new Error("AuthService is not defined. Make sure it is properly injected.");
        }
    }


  register = async (req: express.Request, res: express.Response) => {

    try {
      const { email, password, username } = req.body;
      const serviceResponse = await this.authService.serviceRegister(email, password, username);
      const response: ResponseDto = {
        status: serviceResponse.status,
        error: serviceResponse.error,
        message: serviceResponse.message
      };

      res.status(Number(response.status)).json(response);

    } catch (error: any) {
      let response: ResponseDto = {
        status: 'Server Error - 500',
        error: true,
        message: error.toString()
      }
      return res.status(500).json(response)
    }

  };

   login = async (req: express.Request, res : express.Response) => {
    try {
        const { email, password } = req.body;

        const serviceResponse = await this.authService.login( email, password);
        const response: ResponseDto = {
            status: serviceResponse.status,
            error: serviceResponse.error,
            message: serviceResponse.message,
            token: serviceResponse.token ?? ''
        };

        if(serviceResponse.status === '200'){
            const tokenName = process.env.TOKEN_NAME ?? '_tk_ur';
            res.cookie(tokenName, serviceResponse.token, { domain: 'localhost',path:'/', httpOnly: true });
        }

        res.status(Number(response.status)).json(response);
        
    } catch (error:any) {
        let response: ResponseDto ={
            status: 'Server Error - 500 ',
            error: true,
            message: error.toString()
        }
        return res.status(500).json(response)
        
    }

}

  getUser= async (req: express.Request, res: express.Response)=>{
  try {
      
      const serviceResponse = await this.authService.getUser();

      res.status(Number(200)).json(serviceResponse);
      
  } catch (error: any) {
      let response: ResponseDto ={
          status: 'Server Error - 500 ',
          error: true,
          message: error.toString()
      }
      return res.status(500).json(response)
  }
}


}