import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Medicine, MedicineSchema } from './schemas/medicine.schema'
import { MedicinesService } from './medicines.service'
import { MedicinesController } from './medicines.controller'
@Module({ imports: [MongooseModule.forFeature([{ name: Medicine.name, schema: MedicineSchema }])], providers: [MedicinesService], controllers: [MedicinesController], exports: [MedicinesService] })
export class MedicinesModule {}
