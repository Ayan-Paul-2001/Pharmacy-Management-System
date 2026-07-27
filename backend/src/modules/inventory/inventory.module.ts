import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryMovement, InventoryMovementSchema } from './inventory.schema'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
@Module({ imports: [MongooseModule.forFeature([{ name: InventoryMovement.name, schema: InventoryMovementSchema }])], providers: [InventoryService], controllers: [InventoryController], exports: [InventoryService] }) export class InventoryModule {}
