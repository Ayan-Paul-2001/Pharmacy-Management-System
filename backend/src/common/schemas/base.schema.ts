import { Prop, Schema } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type BaseDocument = HydratedDocument<BaseEntity>
@Schema({ _id: false })
export class BaseEntity { @Prop({ required: true, index: true }) pharmacyId!: string; @Prop({ required: true }) createdBy!: string; @Prop() updatedBy?: string; @Prop({ default: true }) isActive!: boolean }
