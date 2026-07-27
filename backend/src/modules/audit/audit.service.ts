import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuditLog } from './audit.schema'
@Injectable() export class AuditService { constructor(@InjectModel(AuditLog.name) private readonly logs: Model<AuditLog>) {} record(data: Partial<AuditLog>) { return this.logs.create(data) } list(pharmacyId: string) { return this.logs.find({ pharmacyId }).sort({ createdAt: -1 }).limit(200).lean() } }
