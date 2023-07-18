import { getIntegerFromInput, getPositionsFromInput } from './game/logic/cli';
import type { ResponseInput } from './game/logic/game';
import { GameInstance } from './game/logic/game';

async function playGameFromCLI() {
  const game: GameInstance = GameInstance.new();
  while (!game.property.isFinished) {
    // game = GameInstance.fromJson(game.toJson());
    while (true) {
      const s = game.playStep();
      console.log(s);
      const request = game.getRequest();
      //   const command = await responseYield1(gen);
      //   logAndPrint('playGameFromCLI_command ' + JSON.stringify(command));
      console.log(game.toJson());
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

      //   //   game = GameInstance.fromJson(game.toJson());
      //   //   gen = await game.playStepWithQueue();
      //   //   await responseYield1(gen);
      //   logAndPrint('playGameFromCLI_data ' + JSON.stringify(data));
      //   const isDone = await responseYield2(gen, data);
      //   logAndPrint('playGameFromCLI_isDone ' + isDone.toString());
      //   if (isDone) {
      //     break;
      //   }
    }
  }
}

playGameFromCLI();
