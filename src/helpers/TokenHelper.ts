import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const saltRounds = 10;
const secret = process.env.JWT_SECRET;


if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env file");
}

export const generateToken = (payload: any) => {
    return jsonwebtoken.sign(payload, secret!, { expiresIn: '1h', algorithm: 'HS256' });
};

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      console.log('Token verified successfully:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

export const decodeToken = (token: string) => {
    return jsonwebtoken.decode(token);
};

export const isTokenExpired = (token: string) => {
    const decoded = decodeToken(token) as JwtPayload;
    if (decoded && decoded.exp) {
        return decoded.exp < Date.now() / 1000;
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
  