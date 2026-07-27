import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext) { const request = context.switchToHttp().getRequest<Request & { user?: unknown }>(); const token = request.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) throw new UnauthorizedException('Bearer token required'); try { request.user = this.jwt.verify(token); return true } catch { throw new UnauthorizedException('Invalid or expired token') } }
}
