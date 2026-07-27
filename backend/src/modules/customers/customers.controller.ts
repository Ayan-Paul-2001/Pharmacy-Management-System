import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('customers') @UseGuards(JwtAuthGuard, RolesGuard) export class CustomersController { constructor(private readonly customers: CustomersService) {} @Get() list(@CurrentUser() user: any, @Query('search') search?: string) { return this.customers.list(user.pharmacyId, search) } @Post() @Roles(Role.OWNER, Role.EMPLOYEE) create(@CurrentUser() user: any, @Body() body: any) { return this.customers.create({ ...body, pharmacyId: user.pharmacyId }) } }
