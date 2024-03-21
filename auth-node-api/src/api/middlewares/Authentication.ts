import express from 'express';
import { verifyToken } from '../../helpers/TokenHelper';
import { getUserBySessionToken } from "../../db/UsersDb";
import {merge, get, identity} from 'lodash';


export const isAuthenticathed = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const tokenName = process.env.TOKEN_NAME || '_tk_ur';
        const token = req.cookies[tokenName];
       
        if(!token){
            return res.status(401).json({status: '401', error: true, message: 'No Token Provided'});
        }
    
        const IsValidToken = verifyToken(token);
    
    
        if(!IsValidToken){
            return res.status(401).json({status: '401', error: true, message: 'Invalid Token'});
        }
    
        const user = await getUserBySessionToken(token);

        if(!user){
            return res.status(401).json({status: '401', error: true, message: 'User Not Found'});
        }
    
        merge(req, {identity: user});
    
        next();
    } catch (error) {
        return res.status(500).json({status: '500', error: true, message: 'Erro to authenticate user'});
    }
}