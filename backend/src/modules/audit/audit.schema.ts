import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true, index: true })
  action!: string

  @Prop({ required: true })
  entity!: string

  @Prop()
  entityId?: string

  @Prop({ required: true })
  userId!: string

  @Prop({ required: true })
  pharmacyId!: string

  @Prop({ type: Object })
  metadata?: Record<string, unknown>

  @Prop()
  ipAddress?: string
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog)
