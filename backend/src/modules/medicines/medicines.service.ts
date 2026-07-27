import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Medicine, MedicineDocument } from './schemas/medicine.schema'
import { CreateMedicineDto } from './dto/create-medicine.dto'
@Injectable()
export class MedicinesService { constructor(@InjectModel(Medicine.name) private readonly medicines: Model<MedicineDocument>) {} create(dto: CreateMedicineDto, pharmacyId: string) { return this.medicines.create({ ...dto, expiryDate: new Date(dto.expiryDate), pharmacyId, quantityInStock: 0 }) } list(pharmacyId: string, query?: string) { const filter: Record<string, unknown> = { pharmacyId }; if (query) filter.$or = [{ name: new RegExp(query, 'i') }, { genericName: new RegExp(query, 'i') }, { barcode: query }, { category: new RegExp(query, 'i') }]; return this.medicines.find(filter).sort({ name: 1 }).lean() } async findOne(id: string, pharmacyId: string) { const medicine = await this.medicines.findOne({ _id: id, pharmacyId }).lean(); if (!medicine) throw new NotFoundException('Medicine not found'); return medicine } }
