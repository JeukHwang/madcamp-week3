import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Game } from '@prisma/client';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/user/decorator/current.decorator';
import { UpdateDto } from './dto/update.dto';
import type { GameProfile } from './game.service';
import { GameService, toGameProfile } from './game.service';
import { Position } from './logic/move';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Get('create')
  async createGame(@CurrentUser() user: User): Promise<GameProfile> {
    const game: Game = await this.gameService.create(user);
    return toGameProfile(game);
  }

  @Get('current')
  async findCurrent(@CurrentUser() user: User): Promise<GameProfile | null> {
    const game: Game | null = await this.gameService.findCurrent(user);
    return game ? toGameProfile(game) : null;
  }

  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<GameProfile | null> {
    const game: Game | null = await this.gameService.findById(id);
    return game ? toGameProfile(game) : null;
  }

  @Post('update')
  async update(
    @CurrentUser() user: User,
    @Body() body: UpdateDto,
  ): Promise<GameProfile | null> {
    const positions: Position[] = body.positions.map(
      ({ x, y }) => new Position(x, y),
    );
    const game: Game | null = await this.gameService.update(user, positions);
    return game ? toGameProfile(game) : null;
  }
}
