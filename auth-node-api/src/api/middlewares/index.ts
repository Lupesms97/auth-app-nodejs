import express from 'express';
import { verifyToken } from '../../helpers/TokenHelper';
import { getUserByEmail, getUserBySessionToken } from "../../db/UsersDb";
import {merge, get, identity} from 'lodash';


export const isAuthenticathed = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        
        const tokenOnHeaders = req.headers.authorization;
        let accessToken = '';
        

        if(!tokenOnHeaders){
            return res.status(401).json({status: '401', error: true, message: 'No Token Provided'});
        }

        const tokenParts = tokenOnHeaders.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            accessToken = tokenParts[1];
           
        }

        const decoded = await verifyToken(accessToken);
    
        if(!decoded){
            return res.status(401).json({status: '401', error: true, message: 'Invalid Token'});
        }
    
        const user = await getUserByEmail(get(decoded, 'email'));

        if(!user){
            return res.status(401).json({status: '401', error: true, message: 'User Not Found'});
        }
    
        merge(req, {identity: user});
    
        next();
    } catch (error) {
        return res.status(500).json({status: '500', error: true, message: 'Erro to authenticate user'});
    }
}