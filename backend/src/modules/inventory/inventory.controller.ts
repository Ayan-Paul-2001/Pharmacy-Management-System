import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('inventory') @UseGuards(JwtAuthGuard, RolesGuard) export class InventoryController { constructor(private readonly inventory: InventoryService) {} @Get('movements') list(@CurrentUser() user: any, @Query('medicineId') medicineId?: string) { return this.inventory.list(user.pharmacyId, medicineId) } @Post('movements') create(@CurrentUser() user: any, @Body() body: any) { return this.inventory.create({ ...body, pharmacyId: user.pharmacyId, createdBy: user.sub }) } }
