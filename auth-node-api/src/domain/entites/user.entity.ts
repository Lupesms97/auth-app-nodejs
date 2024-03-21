export class UserEntity{
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public username : string,
        public salt: string
    ){}

}