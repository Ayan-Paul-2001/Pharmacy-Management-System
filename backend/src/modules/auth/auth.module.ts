import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { FirebaseService } from './firebase.service'
import { FingerprintService } from './fingerprint.service'
import { WebAuthnService } from './webauthn.service'

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'mediflow-super-secret-jwt-key-2026'),
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN', '24h') || '24h') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, FingerprintService, WebAuthnService],
  exports: [AuthService, JwtModule, FirebaseService, FingerprintService, WebAuthnService],
})
export class AuthModule {}
