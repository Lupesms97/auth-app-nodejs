export interface AuthenticationDetailsDao{
    authentication: {
        password: string,
        salt: string,
        sessionToken: string
    }
}

export function isAuthenticationDetailsDao(obj: any): obj is AuthenticationDetailsDao {
    return 'authentication' in obj;
  }  