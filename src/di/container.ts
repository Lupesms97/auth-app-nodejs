import 'reflect-metadata'
import { Container } from 'inversify'
import { Types } from './types'
import IUserRepository from '../domain/repositories/user.repository'
import UserRepositoryImpl from '../data/repositoriesImpl/user.repositoryImpl'
import TokenService from '../api/services/token.service'
import AuthController from '../api/controllers/auth.controller'
import AuthServiceImpl from '../api/services/authentication.service'
import AuthServiceI from '../api/services/auth.serviceI'

export const container = new Container({ defaultScope: 'Singleton' })

// Repositories interfaces

container.bind<IUserRepository>(Types.IUserRepository).to(UserRepositoryImpl)

// Services 


container.bind<TokenService>(Types.TokenService).to(TokenService)
container.bind<AuthServiceI>(Types.AuthServiceI).to(AuthServiceImpl)

// Controllers

container.bind<AuthController>(Types.AuthController).to(AuthController)


