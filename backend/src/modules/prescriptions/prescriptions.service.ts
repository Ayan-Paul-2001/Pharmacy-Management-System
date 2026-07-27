import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Prescription } from './prescriptions.schema'
@Injectable() export class PrescriptionsService { constructor(@InjectModel(Prescription.name) private readonly prescriptions: Model<Prescription>) {} create(data: Partial<Prescription>) { return this.prescriptions.create({ ...data, prescriptionNumber: data.prescriptionNumber || `RX-${Date.now()}`, status: 'pending' }) } list(pharmacyId: string, customerId?: string) { return this.prescriptions.find({ pharmacyId, ...(customerId ? { customerId } : {}) }).sort({ createdAt: -1 }).lean() } review(id: string, status: 'approved'|'rejected', reviewedBy: string, pharmacyId: string) { return this.prescriptions.findOneAndUpdate({ _id: id, pharmacyId }, { status, reviewedBy }, { new: true }).lean() } }
