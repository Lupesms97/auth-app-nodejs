import express from 'express';
import {container} from '../../di/container'
import { isAuthenticathed } from '../middlewares';
import AuthController from '../controllers/auth.controller';
import { Types } from '../../di/types';

const authContoller = container.get<AuthController>(Types.AuthController)

const router = express.Router();

router.
    route('/user/register')
    .post(authContoller.register)

router.
    route('/user/login')
    .post(authContoller.login)

router.
    route('/user')
    .get(isAuthenticathed, isAuthenticathed, authContoller.getUser)

export default router;
    

