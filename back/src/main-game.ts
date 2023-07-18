import { getIntegerFromInput, getPositionsFromInput } from './game/logic/cli';
import type { ResponseInput } from './game/logic/game';
import { GameInstance } from './game/logic/game';

async function playGameFromCLI() {
  let game: GameInstance = GameInstance.new();
  while (!game.property.isFinished) {
    game = GameInstance.fromJson(game.toJson());
    while (true) {
      game.playStep();
      const request = game.getRequest();
      let data: ResponseInput;
      switch (request.type) {
        case 'number':
          data = {
            type: 'number',
            data: await getIntegerFromInput(request.min, request.max),
          };
          break;
        case 'positions':
          data = {
            type: 'positions',
            data: await getPositionsFromInput(game),
          };
          break;
      }
      game.setResponse(data);
    }
  }
}

playGameFromCLI();
