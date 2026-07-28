import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber!: string

  @Prop({ type: [Object], required: true })
  items!: { medicineId: string; quantity: number; unitPrice: number }[]

  @Prop({ required: true, enum: ['pending', 'approved', 'preparing', 'ready', 'delivered', 'cancelled'], index: true })
  status!: string

  @Prop({ required: true })
  total!: number

  @Prop({ required: true })
  customerId!: string

  @Prop({ required: true, index: true })
  pharmacyId!: string

  @Prop()
  prescriptionId?: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
