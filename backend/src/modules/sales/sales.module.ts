import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Sale, SaleSchema } from './sales.schema'
import { SalesService } from './sales.service'
import { SalesController } from './sales.controller'
@Module({ imports: [MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }])], providers: [SalesService], controllers: [SalesController], exports: [SalesService] }) export class SalesModule {}
