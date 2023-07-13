import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

export type UserProfile = Pick<User, 'id' | 'name' | 'photo'>;
const toUserProfile = (user: User): UserProfile => ({
  id: user.id,
  name: user.name,
  photo: user.photo,
});

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userInfo: CreateDto): Promise<UserProfile> {
    try {
      const user = await this.prismaService.user.create({
        data: { ...userInfo },
      });
      return toUserProfile(user);
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return user ? toUserProfile(user) : null;
  }

  async findByGoogleId(googleId: string): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findUnique({
      where: { googleId },
    });

    return user ? toUserProfile(user) : null;
  }

  async getLeaderboard(): Promise<UserProfile[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take: 5,
    });
    return users.map(toUserProfile);
  }
}
