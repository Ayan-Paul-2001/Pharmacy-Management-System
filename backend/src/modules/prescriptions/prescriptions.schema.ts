import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({ timestamps: true }) export class Prescription { @Prop({ required: true, unique: true }) prescriptionNumber!: string; @Prop({ required: true }) imageUrl!: string; @Prop({ required: true, enum: ['pending','approved','rejected'], index: true }) status!: string; @Prop() notes?: string; @Prop({ required: true }) customerId!: string; @Prop({ required: true, index: true }) pharmacyId!: string; @Prop() reviewedBy?: string }
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription)
