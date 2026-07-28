import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CloudinaryService } from './cloudinary.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file?: any, @Body('base64') base64?: string, @Body('folder') folder?: string) {
    if (!file && !base64) {
      throw new BadRequestException('Please provide an image file or base64 data')
    }

    let payload: string
    if (file) {
      const mime = file.mimetype || 'image/png'
      payload = `data:${mime};base64,${file.buffer.toString('base64')}`
    } else {
      payload = base64!
    }

    const result = await this.cloudinary.uploadImage(payload, folder || 'mediflow_prescriptions')
    return {
      success: true,
      url: result.url,
      publicId: result.public_id,
      uploadedAt: new Date().toISOString(),
    }
  }
}
