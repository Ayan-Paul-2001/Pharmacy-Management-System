import { SetMetadata } from '@nestjs/common'
export enum Role { OWNER = 'owner', EMPLOYEE = 'employee', CUSTOMER = 'customer' }
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
