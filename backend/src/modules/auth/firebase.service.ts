import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService {
  constructor(private readonly config: ConfigService) {}
  async verifyIdToken(idToken: string) {
    try {
      const projectId = this.config.get<string>('FIREBASE_PROJECT_ID')
      const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL')
      const privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
      if (!projectId || !clientEmail || !privateKey) throw new ServiceUnavailableException('Firebase Admin is not configured')
      const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
      return await getAuth(app).verifyIdToken(idToken, true)
    } catch (error) {
      if (error instanceof ServiceUnavailableException) throw error
      throw new UnauthorizedException('Invalid Firebase ID token')
    }
  }
}
