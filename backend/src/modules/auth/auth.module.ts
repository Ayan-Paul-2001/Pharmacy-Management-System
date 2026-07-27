import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { FirebaseService } from './firebase.service'
import { FingerprintService } from './fingerprint.service'
import { WebAuthnService } from './webauthn.service'
@Module({ imports: [UsersModule, JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: (config: ConfigService) => ({ secret: config.getOrThrow('JWT_SECRET'), signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '15m') } }) })], controllers: [AuthController], providers: [AuthService, FirebaseService, FingerprintService, WebAuthnService], exports: [AuthService, JwtModule, FirebaseService, FingerprintService, WebAuthnService] })
export class AuthModule {}
