import { Injectable } from '@nestjs/common';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { generateFileName, storage } from '../../config';
import { UserService } from '../user/user.service';

@Injectable()
export class UploadService {
  constructor(private readonly userService: UserService) {}
  // eslint-disable-next-line max-lines-per-function
  async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const user = await this.userService.getUserById(userId);
    if (user.profilePicture) {
      const imageRef = ref(storage, user.profilePicture.fileOriginalName);
      deleteObject(imageRef);
    }
    const imageRef = ref(
      storage,
      `${process.env.FIREBASE_AVATARS_PATH}/${generateFileName(
        file.originalname,
      )}`,
    );
    await uploadBytes(imageRef, file.buffer);
    const profilePictureUrl = await getDownloadURL(imageRef);
    user.profilePicture.url = profilePictureUrl;
    user.profilePicture.fileOriginalName = file.originalname;
    await user.save();
    return profilePictureUrl;
  }
}
