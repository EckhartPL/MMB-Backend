import { Injectable } from '@nestjs/common';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { UploadEntity } from './entities';

import { generateFileName, storage } from '../../config';
import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';

@Injectable()
export class UploadService {
  constructor(private readonly userService: UserService) {}
  // eslint-disable-next-line max-lines-per-function
  async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadEntity> {
    const user = await this.userService.getUserById(userId);
    // If user have profile picture delete previous one
    if (user.profilePicture) {
      const imageDelRef = ref(storage, user.profilePicture.url);
      await this.removeUserImageById(user.profilePicture.id, user);
      await deleteObject(imageDelRef);
    }
    const fileName = `${process.env.FIREBASE_AVATARS_PATH}/${generateFileName(
      file.originalname,
    )}`;
    const imageRef = ref(storage, fileName);
    await uploadBytes(imageRef, file.buffer);
    const profilePictureUrl = await getDownloadURL(imageRef);
    const upload = await UploadEntity.create({
      fileName,
      url: profilePictureUrl,
    }).save();
    user.profilePicture = upload;
    await user.save();
    return user.profilePicture;
  }

  async removeUserImageById(id: string, user: UserEntity): Promise<void> {
    const image = await UploadEntity.findOneBy({ id });
    user.profilePicture = null;
    await user.save();
    await UploadEntity.remove(image);
  }

  // TODO add upload article background method
}
