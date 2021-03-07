import { injectable } from 'inversify';
import * as cloudinaryPackage from 'cloudinary';
import config from '../config';
import logger from '../utilities/logger';
// TODO: Look into using S3 as storage for product images
export interface CloudinaryService {
  upload(image: string): Promise<string>;
  remove(_id: string): Promise<string>;
}

@injectable()
export class CloudinaryServiceImpl implements CloudinaryService {
  private cloudinary = cloudinaryPackage.v2;
  private CLOUDINARY_CLOUD_NAME: string | undefined;
  private CLOUDINARY_API_KEY: string | undefined;
  private CLOUDINARY_API_SECRET: string | undefined;

  constructor() {
    this.CLOUDINARY_CLOUD_NAME = config.CLOUDINARY_CLOUD_NAME;
    this.CLOUDINARY_API_KEY = config.CLOUDINARY_API_KEY;
    this.CLOUDINARY_API_SECRET = config.CLOUDINARY_API_SECRET;

    this.cloudinary.config({
      cloud_name: this.CLOUDINARY_CLOUD_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    });
  }

  async upload(image: string): Promise<string> {
    try {
      const response = await this.cloudinary.uploader.upload(image, {
        public_id: `${Date.now()}`,
        return_delete_token: true
      });
      return response.secure_url;
    } catch (error) {
      logger.error(
        `[CloudinaryService: upload]: Unable to upload image: ${error}`
      );
      throw error;
    }
  }

  async remove(image: string): Promise<string> {
    try {
      // split the image url to get the image id
      // example url: 'https://res.cloudinary.com/[cloudname]/image/upload/[apikey]/[imageId].jpg'
      const _id = image.split('/').pop()?.split('.').shift() as string;
      const response = await this.cloudinary.uploader.destroy(
        _id,
        (result) => result
      );
      if (response.result == 'not found') {
        throw new Error('Image with the given id not found in Cloudinary');
      }
      return response.result;
    } catch (error) {
      logger.error(
        `[CloudinaryService: remove]: Unable to remove image: ${error}`
      );
      throw error;
    }
  }
}
