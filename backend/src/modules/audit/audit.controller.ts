import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuditService } from './audit.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles, Role } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
@Controller('audit') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.OWNER) export class AuditController { constructor(private readonly audit: AuditService) {} @Get() list(@CurrentUser() user: any) { return this.audit.list(user.pharmacyId) } }
