import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from '../../../common/decorators/roles.decorator'
import { HydratedDocument } from 'mongoose'
export type UserDocument = HydratedDocument<User>
@Schema({ timestamps: true })
export class User { @Prop({ required: true }) name!: string; @Prop({ required: true, unique: true, lowercase: true, index: true }) email!: string; @Prop() phone?: string; @Prop({ enum: Role, required: true, index: true }) role!: Role; @Prop({ required: true, index: true }) pharmacyId!: string; @Prop({ default: true }) isActive!: boolean; @Prop({ index: true }) firebaseUid?: string; @Prop({ default: [] }) permissions!: string[]; @Prop({ default: [] }) webauthnCredentials!: { credentialID: string; publicKey: string; counter: number; transports?: string[] }[] }
export const UserSchema = SchemaFactory.createForClass(User)
