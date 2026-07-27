import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { FirebaseService } from './firebase.service'
import { FingerprintService } from './fingerprint.service'
import { WebAuthnService } from './webauthn.service'
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/server'
@Controller('auth')
export class AuthController { constructor(private readonly auth: AuthService, private readonly firebase: FirebaseService, private readonly fingerprint: FingerprintService, private readonly webauthn: WebAuthnService) {} @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto) } @Get('me') @UseGuards(JwtAuthGuard) me(@CurrentUser() user: unknown) { return user } @Post('firebase/exchange') exchange(@Body('idToken') idToken: string) { return this.auth.firebaseExchange(idToken) } @Post('fingerprint/verify') fingerprintVerify(@Body('eventId') eventId: string) { return this.fingerprint.verifyEvent(eventId) } @Get('webauthn/register/options') @UseGuards(JwtAuthGuard) registerOptions(@CurrentUser() user: any) { return this.webauthn.registrationOptions(user.sub) } @Post('webauthn/register/verify') @UseGuards(JwtAuthGuard) registerVerify(@CurrentUser() user: any, @Body() body: { response: RegistrationResponseJSON; challenge: string }) { return this.webauthn.verifyRegistration(user.sub, body.response, body.challenge) } @Post('webauthn/login/options') loginOptions(@Body('email') email: string) { return this.webauthn.authenticationOptions(email) } @Post('webauthn/login/verify') async loginVerify(@Body() body: { email: string; response: AuthenticationResponseJSON; challenge: string }) { const result = await this.webauthn.verifyAuthentication(body.email, body.response, body.challenge); return this.auth.webauthnIssue(result.user) } }
