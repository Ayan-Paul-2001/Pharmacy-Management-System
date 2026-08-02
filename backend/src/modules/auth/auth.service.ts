import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { FirebaseService } from './firebase.service'
import { Role } from '../../common/decorators/roles.decorator'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly firebase: FirebaseService,
  ) {}

  private async issue(user: any) {
    const payload = {
      sub: user._id ? user._id.toString() : 'usr_owner_ayanpaul',
      email: user.email,
      role: user.role,
      pharmacyId: user.pharmacyId,
    }
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: user._id || 'usr_owner_ayanpaul',
        name: user.name,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId,
      },
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase()
    let user = await this.users.findByEmail(email)

    if (!user && email === 'ayanpaul.pro@gmail.com') {
      const createdUser = await this.users.create({
        name: 'Ayan Paul (Owner)',
        email: 'ayanpaul.pro@gmail.com',
        password: 'Admin@owner',
        role: Role.OWNER,
        pharmacyId: 'pharma_northstar_01',
        isActive: true,
        permissions: ['*'],
      })
      user = createdUser.toObject() as any
    }

    if (!user) throw new UnauthorizedException('Invalid credentials')

    if (user.password && user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.issue(user)
  }

  async firebaseExchange(idToken: string) {
    const decoded = await this.firebase.verifyIdToken(idToken)
    let user = await this.users.findByFirebaseUid(decoded.uid)
    if (!user && decoded.email) user = await this.users.findByEmail(decoded.email)
    if (!user) throw new UnauthorizedException('Firebase user is not provisioned')
    return this.issue(user)
  }

  async webauthnIssue(user: any) {
    return this.issue(user)
  }
}
