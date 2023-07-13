import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './user/decorator/current.decorator';
import { UserProfile } from './user/user.service';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/test/public')
  getDatePublicly(): string {
    return this.appService.getDatePublicly();
  }

  @Get('/test/private')
  getDatePrivately(@CurrentUser() user: UserProfile): string {
    return this.appService.getDatePrivately(user);
  }
}
