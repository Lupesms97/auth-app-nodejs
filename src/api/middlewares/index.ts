import express from 'express';
import {merge, get, identity} from 'lodash';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import IUserRepository from '../../domain/repositories/user.repository';
import { container } from '../../di/container';
import { Types } from '../../di/types';
import TokenService from '../services/token.service';

const userRespository: IUserRepository = container.get<IUserRepository>(Types.IUserRepository);
const tokenService: TokenService = container.get<TokenService>(Types.TokenService);

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

        const decoded = await tokenService.verifyToken(accessToken);

        if (typeof decoded === 'string') {
            return res.status(401).json({ status: '401', error: true, message: decoded });
        }

        const user = await userRespository.getUserByEmail(get(decoded, 'email'));

        if (!user) {
            return res.status(401).json({ status: '401', error: true, message: 'User Not Found' });
        }
    
        merge(req, {identity: user});
    
        next();
    } catch (error) {
        return res.status(500).json({status: '500', error: true, message: 'Erro to authenticate user'});
    }
}