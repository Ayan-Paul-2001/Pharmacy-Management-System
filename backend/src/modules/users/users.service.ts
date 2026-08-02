import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Role } from '../../common/decorators/roles.decorator'

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {}

  async onApplicationBootstrap() {
    await this.seedDefaultOwner()
  }

  async seedDefaultOwner() {
    const ownerEmail = 'ayanpaul.pro@gmail.com'
    const existing = await this.users.findOne({ email: ownerEmail })
    if (!existing) {
      await this.users.create({
        name: 'Ayan Paul (Owner)',
        email: ownerEmail,
        password: 'Admin@owner',
        role: Role.OWNER,
        pharmacyId: 'pharma_northstar_01',
        isActive: true,
        permissions: ['*'],
      })
    } else if (existing.role !== Role.OWNER || existing.password !== 'Admin@owner') {
      await this.users.updateOne(
        { email: ownerEmail },
        { $set: { role: Role.OWNER, password: 'Admin@owner', isActive: true } }
      )
    }
  }

  async findByEmail(email: string) {
    return this.users.findOne({ email: email.toLowerCase(), isActive: true }).lean()
  }

  async findByFirebaseUid(firebaseUid: string) {
    return this.users.findOne({ firebaseUid, isActive: true }).lean()
  }

  async findById(id: string) {
    const user = await this.users.findById(id).lean()
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async addWebAuthnCredential(id: string, credential: User['webauthnCredentials'][number]) {
    return this.users.findByIdAndUpdate(id, { $push: { webauthnCredentials: credential } }, { new: true }).lean()
  }

  async updateWebAuthnCounter(id: string, credentialID: string, counter: number) {
    return this.users.findOneAndUpdate(
      { _id: id, 'webauthnCredentials.credentialID': credentialID },
      { $set: { 'webauthnCredentials.$.counter': counter } },
      { new: true }
    ).lean()
  }

  async create(data: Partial<User>) {
    return this.users.create(data)
  }
}
