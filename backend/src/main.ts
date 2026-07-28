import * as dns from 'dns'
// Set public DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (e) {
  // fallback if system restricts dns.setServers
}

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: config.get<string>('FRONTEND_URL', 'http://localhost:3000'), credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  await app.listen(config.get<number>('PORT', 4000))
}
bootstrap()
