import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name)

  constructor(private readonly config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME')
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY')
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET')

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      })
      this.logger.log('Cloudinary SDK configured successfully')
    } else {
      this.logger.warn('Cloudinary environment variables missing. Operating in dev fallback mode.')
    }
  }

  async uploadImage(fileBufferOrBase64: string, folder = 'mediflow_prescriptions'): Promise<{ url: string; public_id?: string }> {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME')
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY')

    if (cloudName && apiKey) {
      try {
        const res = await cloudinary.uploader.upload(fileBufferOrBase64, {
          folder,
          resource_type: 'auto',
        })
        return { url: res.secure_url, public_id: res.public_id }
      } catch (err: any) {
        this.logger.error(`Cloudinary upload failed: ${err.message}`)
        throw err
      }
    }

    // Dev fallback if Cloudinary API keys aren't specified yet
    const mockId = 'cld_rx_' + Math.random().toString(36).substring(2, 9)
    return {
      url: fileBufferOrBase64.startsWith('data:')
        ? fileBufferOrBase64
        : `https://res.cloudinary.com/demo/image/upload/v1680000000/mediflow/${mockId}.png`,
      public_id: `mediflow/${mockId}`,
    }
  }
}
