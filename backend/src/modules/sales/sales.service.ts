import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Sale } from './sales.schema'
@Injectable() export class SalesService { constructor(@InjectModel(Sale.name) private readonly sales: Model<Sale>) {} create(data: Partial<Sale>) { return this.sales.create({ ...data, invoiceNumber: data.invoiceNumber || `INV-${Date.now()}` }) } list(pharmacyId: string) { return this.sales.find({ pharmacyId }).sort({ createdAt: -1 }).lean() } }
