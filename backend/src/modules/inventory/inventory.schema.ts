import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({ timestamps: true }) export class InventoryMovement { @Prop({ required: true, index: true }) medicineId!: string; @Prop({ required: true }) type!: 'purchase'|'sale'|'return'|'damage'|'adjustment'; @Prop({ required: true }) quantity!: number; @Prop() reason?: string; @Prop({ required: true, index: true }) pharmacyId!: string; @Prop({ required: true }) createdBy!: string }
export const InventoryMovementSchema = SchemaFactory.createForClass(InventoryMovement)
