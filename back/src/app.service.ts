import { Injectable } from '@nestjs/common';
import { UserProfile } from './user/user.service';

@Injectable()
export class AppService {
  getDatePublicly(): string {
    return `Public Date | ${new Date().toISOString()}`;
  }

  getDatePrivately(user: UserProfile): string {
    return `Private Date | ${new Date().toISOString()} | ${JSON.stringify(
      user,
    )}}`;
  }
}
