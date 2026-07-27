import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({ timestamps: true }) export class Supplier { @Prop({ required: true, index: true }) name!: string; @Prop() company?: string; @Prop({ required: true }) phone!: string; @Prop() email?: string; @Prop() address?: string; @Prop() paymentTerms?: string; @Prop({ default: 0 }) outstandingBalance!: number; @Prop({ required: true, index: true }) pharmacyId!: string; @Prop({ default: true }) isActive!: boolean }
export const SupplierSchema = SchemaFactory.createForClass(Supplier)
