import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  invoiceNumber!: string

  @Prop({ type: [Object], required: true })
  items!: { medicineId: string; name: string; quantity: number; unitPrice: number }[]

  @Prop({ required: true })
  subtotal!: number

  @Prop({ default: 0 })
  discount!: number

  @Prop({ default: 0 })
  tax!: number

  @Prop({ required: true })
  total!: number

  @Prop({ required: true })
  paymentMethod!: string

  @Prop()
  customerId?: string

  @Prop({ required: true, index: true })
  pharmacyId!: string

  @Prop({ required: true })
  employeeId!: string
}

export const SaleSchema = SchemaFactory.createForClass(Sale)
