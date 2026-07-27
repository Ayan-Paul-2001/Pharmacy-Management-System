import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { MedicinesService } from './medicines.service'
import { CreateMedicineDto } from './dto/create-medicine.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('medicines') @UseGuards(JwtAuthGuard, RolesGuard)
export class MedicinesController { constructor(private readonly medicines: MedicinesService) {} @Get() list(@CurrentUser() user: any, @Query('search') search?: string) { return this.medicines.list(user.pharmacyId, search) } @Get(':id') findOne(@CurrentUser() user: any, @Param('id') id: string) { return this.medicines.findOne(id, user.pharmacyId) } @Post() @Roles(Role.OWNER) create(@CurrentUser() user: any, @Body() dto: CreateMedicineDto) { return this.medicines.create(dto, user.pharmacyId) } }
