import 'reflect-metadata';
import { Container } from 'inversify';
import { IAuthService, AuthService } from '$lib/services/AuthService';
import { TYPES } from '$lib/types/symbols';

export const diContainer = new Container();

// Register services
diContainer.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
