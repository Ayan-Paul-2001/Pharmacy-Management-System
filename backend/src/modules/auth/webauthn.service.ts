import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/server'
import { UsersService } from '../users/users.service'

@Injectable()
export class WebAuthnService {
  constructor(private readonly users: UsersService, private readonly config: ConfigService) {}
  private get rpID() { return this.config.get<string>('WEBAUTHN_RP_ID', 'localhost') }
  private get origin() { return this.config.get<string>('WEBAUTHN_ORIGIN', 'http://localhost:3000') }
  async registrationOptions(userId: string) {
    const user = await this.users.findById(userId)
    const options = await generateRegistrationOptions({ rpName: this.config.get<string>('WEBAUTHN_RP_NAME', 'Mediflow Pharmacy'), rpID: this.rpID, userName: user.email, userDisplayName: user.name, userID: Buffer.from(user._id.toString()), attestationType: 'none', excludeCredentials: (user.webauthnCredentials ?? []).map(credential => ({ id: credential.credentialID, transports: credential.transports as any })) })
    return options
  }
  async verifyRegistration(userId: string, response: RegistrationResponseJSON, expectedChallenge: string) {
    const verification = await verifyRegistrationResponse({ response, expectedChallenge, expectedOrigin: this.origin, expectedRPID: this.rpID })
    if (!verification.verified || !verification.registrationInfo) throw new UnauthorizedException('WebAuthn registration failed')
    const { credential } = verification.registrationInfo
    const user = await this.users.findById(userId)
    await this.users.addWebAuthnCredential(userId, { credentialID: credential.id, publicKey: Buffer.from(credential.publicKey).toString('base64'), counter: credential.counter, transports: response.response.transports })
    return { verified: true }
  }
  async authenticationOptions(email: string) { const user = await this.users.findByEmail(email); if (!user) throw new UnauthorizedException('User not found'); return generateAuthenticationOptions({ rpID: this.rpID, allowCredentials: (user.webauthnCredentials ?? []).map(credential => ({ id: credential.credentialID, transports: credential.transports as any })) }) }
  async verifyAuthentication(email: string, response: AuthenticationResponseJSON, expectedChallenge: string) { const user = await this.users.findByEmail(email); if (!user) throw new UnauthorizedException('User not found'); const stored = (user.webauthnCredentials ?? []).find(item => item.credentialID === response.id); if (!stored) throw new UnauthorizedException('Passkey not registered'); const verification = await verifyAuthenticationResponse({ response, expectedChallenge, expectedOrigin: this.origin, expectedRPID: this.rpID, credential: { id: stored.credentialID, publicKey: Buffer.from(stored.publicKey, 'base64'), counter: stored.counter, transports: stored.transports as any } }); if (!verification.verified) throw new UnauthorizedException('WebAuthn authentication failed'); await this.users.updateWebAuthnCounter(user._id.toString(), stored.credentialID, verification.authenticationInfo.newCounter); return { user, newCounter: verification.authenticationInfo.newCounter } }
}
