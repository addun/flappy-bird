import { GameBoardBuilder } from "./buildres/game.builder";
import { LevelBuilder } from "./buildres/lvl.builder";
import { GameBoard, GameLvl } from "./models/game.model";

function gameFactory(lvl: "eazy" | "normal" | "hard"): GameBoard {
  let gameLvl!: GameLvl;
  switch (lvl) {
    case "eazy":
      gameLvl = LevelBuilder()
        .setGap(50)
        .setMinDelay(3500)
        .setMaxDelay(5000)
        .build();
    case "normal":
      gameLvl = LevelBuilder()
        .setGap(35)
        .setMinDelay(2500)
        .setMaxDelay(3500)
        .build();
      break;
    case "hard":
      gameLvl = LevelBuilder()
        .setGap(25)
        .setMinDelay(1250)
        .setMaxDelay(1750)
        .build();
      break;
  }

  const bird = document.querySelector("#bird") as HTMLElement;
  const pipe = document.querySelector("#pipe") as HTMLElement;
  const board = document.querySelector("#board") as HTMLDivElement;

  board.innerHTML = ``;

  const game = GameBoardBuilder()
    .setBoard(board)
    .setX(1500)
    .setY(500)
    .setBirdAppearance(bird)
    .setObstacleAppearance(pipe)
    .setLvl(gameLvl)
    .build();

  return game;
}

document.addEventListener("DOMContentLoaded", function () {
  startGame(document.querySelector("#neweazygame")!, "eazy");
  startGame(document.querySelector("#newnormalgame")!, "normal");
  startGame(document.querySelector("#newhardgame")!, "hard");
});

function startGame(btn: HTMLButtonElement, lvl: "eazy" | "normal" | "hard") {
  btn.addEventListener("click", function () {
    const game = gameFactory(lvl);
    game.start();
    const pointsEl = document.querySelector("#points")!;
    game.points$.subscribe((p) => (pointsEl.innerHTML = p.toString()));
  });
}
