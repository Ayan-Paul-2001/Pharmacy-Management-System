import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('orders') @UseGuards(JwtAuthGuard, RolesGuard) export class OrdersController { constructor(private readonly orders: OrdersService) {} @Get() list(@CurrentUser() user: any) { return this.orders.list(user.pharmacyId, user.role === Role.CUSTOMER ? user.sub : undefined) } @Post() @Roles(Role.CUSTOMER) create(@CurrentUser() user: any, @Body() body: any) { return this.orders.create({ ...body, pharmacyId: user.pharmacyId, customerId: user.sub }) } @Patch(':id/status') @Roles(Role.OWNER, Role.EMPLOYEE) update(@CurrentUser() user: any, @Param('id') id: string, @Body('status') status: string) { return this.orders.updateStatus(id, status, user.pharmacyId) } }
