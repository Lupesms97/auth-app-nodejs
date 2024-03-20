import express from "express";
import { ResponseDto } from "../models/ResponseDtoI";


const autService = require('../services/authenticationService')

export const register = async (req: express.Request, res: express.Response) => {

    try {
        const { email, password, username } = req.body;
        

        const serviceResponse = await autService.serviceRegister(email, password, username);
        const response: ResponseDto = {
            status: serviceResponse.status,
            error: serviceResponse.error,
            message: serviceResponse.message
        };

        res.status(Number(response.status)).json(response);

    } catch (error: any) {
        let response: ResponseDto ={
            status: 'Server Error - 500 ',
            error: true,
            message: error.toString()
        }
        return res.status(500).json(response)
    }

};

export const login = async (req: express.Request, res : express.Response) => {
    try {
        const { email, password } = req.body;

        const serviceResponse = await autService.login( email, password);
        const response: ResponseDto = {
            status: serviceResponse.status,
            error: serviceResponse.error,
            message: serviceResponse.message
        };
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

