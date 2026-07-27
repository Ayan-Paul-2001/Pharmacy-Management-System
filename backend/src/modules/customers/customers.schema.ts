import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({ timestamps: true }) export class Customer { @Prop({ required: true }) name!: string; @Prop({ required: true, index: true }) phone!: string; @Prop({ index: true }) email?: string; @Prop() address?: string; @Prop({ default: 0 }) loyaltyPoints!: number; @Prop({ required: true, index: true }) pharmacyId!: string; @Prop({ default: true }) isActive!: boolean }
export const CustomerSchema = SchemaFactory.createForClass(Customer)
