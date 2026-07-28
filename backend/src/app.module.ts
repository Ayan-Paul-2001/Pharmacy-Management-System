import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { MedicinesModule } from './modules/medicines/medicines.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { SalesModule } from './modules/sales/sales.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module'
import { CustomersModule } from './modules/customers/customers.module'
import { SuppliersModule } from './modules/suppliers/suppliers.module'
import { AuditModule } from './modules/audit/audit.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI', 'mongodb://127.0.0.1:27017/mediflow')
        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          family: 4,
        }
      },
    }),
    AuthModule,
    UsersModule,
    MedicinesModule,
    InventoryModule,
    SalesModule,
    OrdersModule,
    PrescriptionsModule,
    CustomersModule,
    SuppliersModule,
    AuditModule,
  ],
})
export class AppModule {}
