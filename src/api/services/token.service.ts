import jsonwebtoken, { decode, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { injectable } from 'inversify';

@injectable()
export default class TokenService {
    secret: string ;
    expiresIn: string ;

    constructor() {
        this.secret = process.env.JWT_SECRET ?? 'Helena090821';
        this.expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';


            
        if (!this.secret) {
            throw new Error("JWT_SECRET is not defined in .env file");
        }
    }

    
    

    
    async generateToken(payload: any): Promise<string> {
        const token = jsonwebtoken.sign(payload, this.secret!, { expiresIn: '1h', algorithm: 'HS256', noTimestamp:false });
        return token;
    };
    
    async verifyToken(token: string): Promise<JwtPayload | string> {
        try {
          const decoded = jsonwebtoken.verify(token, this.secret!) as JwtPayload;
          console.log('Token verified successfully:', decoded);
          return decoded;
        } catch (error:any) {
          console.error('Error verifying token:', error);
          return error.message;
        }
    }
    
    async decodeToken(token: string): Promise<JwtPayload | null>{
        return jsonwebtoken.decode(token) as JwtPayload;
    };
    
    async isTokenValid(token: string): Promise<boolean>{
        const decoded = this.decodeToken(token) as JwtPayload;
        if (decoded && decoded.exp) {
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now();
            const timeDifference = expirationTime - currentTime;
            return timeDifference <= 3600000;
        }
        return true;
    };
    
    async getTokenFromHeaders(headers: any): Promise<string | null>{
        if (headers && headers.authorization) {
            const parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            }
        }
        return null;
    };
    
    async generateRadomSalt(email: string):Promise<string> {
        return jsonwebtoken.sign(email , this.secret!);
    }
    
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    }
    
    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}