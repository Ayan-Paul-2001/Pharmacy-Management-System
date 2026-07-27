import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Supplier } from './suppliers.schema'
@Injectable() export class SuppliersService { constructor(@InjectModel(Supplier.name) private readonly suppliers: Model<Supplier>) {} create(data: Partial<Supplier>) { return this.suppliers.create(data) } list(pharmacyId: string) { return this.suppliers.find({ pharmacyId, isActive: true }).sort({ name: 1 }).lean() } }
