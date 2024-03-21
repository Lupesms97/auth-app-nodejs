import express from 'express';
import AuthRouter from './AuthRouter';


const router = express.Router();

export default (): express.Router => {
    AuthRouter(router);
    
    return router;
}