import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { PrescriptionsService } from './prescriptions.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('prescriptions') @UseGuards(JwtAuthGuard, RolesGuard) export class PrescriptionsController { constructor(private readonly prescriptions: PrescriptionsService) {} @Get() list(@CurrentUser() user: any) { return this.prescriptions.list(user.pharmacyId, user.role === Role.CUSTOMER ? user.sub : undefined) } @Post() @Roles(Role.CUSTOMER) create(@CurrentUser() user: any, @Body() body: any) { return this.prescriptions.create({ ...body, pharmacyId: user.pharmacyId, customerId: user.sub }) } @Patch(':id/review') @Roles(Role.OWNER, Role.EMPLOYEE) review(@CurrentUser() user: any, @Param('id') id: string, @Body('status') status: 'approved'|'rejected') { return this.prescriptions.review(id, status, user.sub, user.pharmacyId) } }
