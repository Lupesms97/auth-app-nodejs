import jsonwebtoken, { decode, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const saltRounds = 10;
const secret = process.env.JWT_SECRET;


if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env file");
}

export const generateToken = (payload: any) => {
    const token = jsonwebtoken.sign(payload, secret!, { expiresIn: '1h', algorithm: 'HS256', noTimestamp:false });
    return token;
};

export async function verifyToken(token: string): Promise<JwtPayload | string> {
    try {
      const decoded = jsonwebtoken.verify(token, secret!) as JwtPayload;
      console.log('Token verified successfully:', decoded);
      return decoded;
    } catch (error:any) {
      console.error('Error verifying token:', error);
      return error.message;
    }
}

export const decodeToken = (token: string) => {
    return jsonwebtoken.decode(token);
};

export const isTokenValid = (token: string): boolean => {
    const decoded = decodeToken(token) as JwtPayload;
    if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeDifference = expirationTime - currentTime;
        return timeDifference <= 3600000;
    }
    return true;
};

export const getTokenFromHeaders = (headers: any) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return null;
};

export const generateRadomSalt = (email: string) => {
    return jsonwebtoken.sign(email , secret!);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
  