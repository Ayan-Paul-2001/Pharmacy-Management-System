import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { SalesService } from './sales.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('sales') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.OWNER, Role.EMPLOYEE) export class SalesController { constructor(private readonly sales: SalesService) {} @Get() list(@CurrentUser() user: any) { return this.sales.list(user.pharmacyId) } @Post() create(@CurrentUser() user: any, @Body() body: any) { return this.sales.create({ ...body, pharmacyId: user.pharmacyId, employeeId: user.sub }) } }
