import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FingerprintService {
  constructor(private readonly config: ConfigService) {}
  async verifyEvent(eventId: string) {
    const apiKey = this.config.get<string>('FINGERPRINT_SERVER_API_KEY')
    if (!apiKey) throw new ServiceUnavailableException('FingerprintJS server API is not configured')
    const response = await fetch(`https://api.fpjs.io/events/${encodeURIComponent(eventId)}`, { headers: { Authorization: `Bearer ${apiKey}` } })
    if (!response.ok) throw new UnauthorizedException('FingerprintJS event could not be verified')
    return response.json()
  }
}
