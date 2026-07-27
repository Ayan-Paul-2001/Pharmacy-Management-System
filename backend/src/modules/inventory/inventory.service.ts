import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { InventoryMovement } from './inventory.schema'
@Injectable() export class InventoryService { constructor(@InjectModel(InventoryMovement.name) private readonly movements: Model<InventoryMovement>) {} create(data: Partial<InventoryMovement>) { return this.movements.create(data) } list(pharmacyId: string, medicineId?: string) { return this.movements.find({ pharmacyId, ...(medicineId ? { medicineId } : {}) }).sort({ createdAt: -1 }).lean() } }
