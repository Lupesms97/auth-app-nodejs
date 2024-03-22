
export class UserEntity{
    public id?: string
    public username: string
    public email:string
    public authentication: {
        password: string,
        salt: string,
        sessionToken: string
    }


    constructor(
    username: string,
    email:string,
    authentication: {
        password: string,
        salt: string,
        sessionToken: string
    }
    ){
        this.username = username
        this.email = email
        this.authentication = authentication
    }

}