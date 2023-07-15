import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from './decorator/current.decorator';
import { UserProfile, UserService, toUserProfile } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  async getCurrentUser(@CurrentUser() user: User): Promise<UserProfile> {
    return toUserProfile(user);
  }

  @Get('id/:id')
  async getOneUser(@Param('id') id: string): Promise<UserProfile | null> {
    const user = await this.userService.findById(id);
    return user ? toUserProfile(user) : null;
  }

  @Get('leaderboard')
  async getLeaderboard(): Promise<UserProfile[]> {
    return await this.userService.getLeaderboard();
  }
}