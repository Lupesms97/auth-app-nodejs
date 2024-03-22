import { AuthenticationDetailsDao } from "../models/authenticationDetails";
import { InformationDao } from "../models/information.dao";
import { ResponseDto } from "../models/response.dto";

export interface AuthServiceI {
    serviceRegister(email: string, password: string, username: string): Promise<ResponseDto>;
    login(email: string, password: string): Promise<ResponseDto>;
    getUser(): Promise<ResponseDto>;
    verifyTokenInformation(email: string, token: string, salt: string): Promise<InformationDao>;
    getUserWithCredentials(email: string): Promise<AuthenticationDetailsDao | null>;
  }
  