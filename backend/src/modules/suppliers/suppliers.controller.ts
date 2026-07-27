import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { SuppliersService } from './suppliers.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('suppliers') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.OWNER) export class SuppliersController { constructor(private readonly suppliers: SuppliersService) {} @Get() list(@CurrentUser() user: any) { return this.suppliers.list(user.pharmacyId) } @Post() create(@CurrentUser() user: any, @Body() body: any) { return this.suppliers.create({ ...body, pharmacyId: user.pharmacyId }) } }
