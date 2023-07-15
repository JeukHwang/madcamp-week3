import { ForbiddenException, Injectable } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameInstance, GameInstanceJSON } from './logic/game';
import { Move, Position } from './logic/move';

export type GameProfile = Pick<
  Game,
  'id' | 'userId' | 'turn' | 'json' | 'isFinished'
>;
export const toGameProfile = (game: Game): GameProfile => ({
  id: game.id,
  userId: game.userId,
  turn: game.turn,
  json: game.json,
  isFinished: game.isFinished,
});

@Injectable()
export class GameService {
  constructor(private prismaService: PrismaService) {}
  async create(user: User): Promise<Game> {
    try {
      const existGame = await this.findCurrent(user);
      if (existGame) {
        throw new ForbiddenException(`Game exist ${user.id}`);
      }
      const gameObj = GameInstance.new().toJson();
      const game = await this.prismaService.game.create({
        data: { userId: user.id, json: gameObj },
      });
      return game;
    } catch (e) {
      throw e;
    }
  }

  async update(user: User, positions: Position[]): Promise<Game> {
    try {
      const game_: Game | null = await this.findCurrent(user);
      if (!game_) {
        throw new ForbiddenException(`Game not exist ${user.id}`);
      }
      const game = GameInstance.fromJson(game_.json as GameInstanceJSON);
      const move: Move = await game.getMoveFromPositions(positions);
      await game.playStep(move);
      const newGame: Game = await this.prismaService.game.update({
        where: { id: game_.id },
        data: { json: game.toJson() },
      });
      return newGame;
    } catch (e) {
      throw new ForbiddenException(`Invalid move ${user.id}`);
    }
  }

  async findCurrent(user: User): Promise<Game | null> {
    const game: Game[] = await this.prismaService.game.findMany({
      where: { userId: user.id, isFinished: false },
    });
    if (game.length === 0) {
      return null;
    } else if (game.length === 1) {
      return game[0];
    } else {
      console.error(`Multiple game exist ${user.id}`);
      throw new ForbiddenException(`Multiple game exist ${user.id}`);
    }
  }

  async findById(id: string): Promise<Game | null> {
    const game: Game | null = await this.prismaService.game.findUnique({
      where: { id },
    });
    return game;
  }
}
