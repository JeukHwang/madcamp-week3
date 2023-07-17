import { getIntegerFromInput, getPositionsFromInput } from './game/logic/cli';
import { GameInstance } from './game/logic/game';

async function playGameFromCLI() {
  const game = GameInstance.new();
  while (true) {
    const gen = await game.playStep();
    let step = await gen.next();
    while (!step.done) {
      const command = step.value;
      switch (command.type) {
        case 'number':
          const number = await getIntegerFromInput(command.min, command.max);
          step = await gen.next(number);
          break;
        case 'positions':
          const positions = await getPositionsFromInput(game);
          step = await gen.next(positions);
          break;
        default:
          break;
      }
    }
    // TODO : check game is serializable
    // game = GameInstance.fromJson(game.toJson());
  }
}

playGameFromCLI();
