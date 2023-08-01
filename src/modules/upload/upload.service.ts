import { Injectable, Logger } from '@nestjs/common';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UploadResponse } from 'types';

import { generateFileName, storage } from '../../config';
import { UserService } from '../user/user.service';

@Injectable()
export class UploadService {
  constructor(private readonly userService: UserService) {}
  async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadResponse> {
    const user = await this.userService.getUserById(userId);
    const imageRef = ref(
      storage,
      `${process.env.FIREBASE_AVATARS_PATH}/${generateFileName(
        file.originalname,
      )}`,
    );
    await uploadBytes(imageRef, file.buffer);
    const url = await getDownloadURL(imageRef);
    Logger.log(url);
    user.profilePictureUrl = url;
    await user.save();
    return {
      url,
      filename: file.filename,
    };
  }
}
