import mongoose from "mongoose"

export interface IUser{
    _id?: string
    username: string
    email:string
    authentication: {
        password: string,
        salt: string,
        sessionToken: string
    }
}

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false}
    }
});

export const UserModel = mongoose.model('User', userSchema);

