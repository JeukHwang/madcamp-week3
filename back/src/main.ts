import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Game } from './game/logic/game';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3001', // for frontend in development
      'https://madcamp-week3-front.up.railway.app/', // for frontend in production
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server start: http://localhost:${port}`);
}
// bootstrap();

async function game() {
  let game = Game.new();
  let gameJSON;
  while (true) {
    await game.play();
    gameJSON = game.toJson();
    game = Game.fromJson(gameJSON);
  }
}

game();
