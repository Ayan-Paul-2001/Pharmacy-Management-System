import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order } from './orders.schema'
@Injectable() export class OrdersService { constructor(@InjectModel(Order.name) private readonly orders: Model<Order>) {} create(data: Partial<Order>) { return this.orders.create({ ...data, orderNumber: data.orderNumber || `ORD-${Date.now()}`, status: data.status || 'pending' }) } list(pharmacyId: string, customerId?: string) { return this.orders.find({ pharmacyId, ...(customerId ? { customerId } : {}) }).sort({ createdAt: -1 }).lean() } updateStatus(id: string, status: string, pharmacyId: string) { return this.orders.findOneAndUpdate({ _id: id, pharmacyId }, { status }, { new: true }).lean() } }
