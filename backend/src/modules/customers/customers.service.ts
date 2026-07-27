import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Customer } from './customers.schema'
@Injectable() export class CustomersService { constructor(@InjectModel(Customer.name) private readonly customers: Model<Customer>) {} create(data: Partial<Customer>) { return this.customers.create(data) } list(pharmacyId: string, query?: string) { return this.customers.find({ pharmacyId, ...(query ? { $or: [{ name: new RegExp(query, 'i') }, { phone: query }, { email: new RegExp(query, 'i') }] } : {}) }).sort({ name: 1 }).lean() } }
