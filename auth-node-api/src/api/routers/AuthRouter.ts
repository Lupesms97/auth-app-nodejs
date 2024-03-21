import express from 'express';

import { register, login,getUser } from '../controllers/AuthenticationController';
import { isAuthenticathed } from '../middlewares/Authentication';

export default (router:express.Router)=>{
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.get('/auth/user', isAuthenticathed, getUser)
}