import { createNewObstacleEventFactory } from "../factories/delay.factory";
import { createObstacleMovelViewConnectorFactory } from "../factories/obstacle.factory";
import { Bird, BirdModelViewConnector } from "../models/bird.model";
import { GameBoard, GameLvl } from "../models/game.model";

export function GameBoardBuilder() {
  return {
    setBoard(container: HTMLElement) {
      return {
        setX(x: number) {
          return {
            setY(y: number) {
              return {
                setBirdAppearance(birdAppearance: HTMLElement) {
                  return {
                    setObstacleAppearance(obstacleAppearance: HTMLElement) {
                      return {
                        setLvl(lvl: GameLvl) {
                          return {
                            build() {
                              const bird = new Bird();
                              bird.x$.next(5);

                              const birdConnector = new BirdModelViewConnector(
                                bird,
                                birdAppearance,
                                container
                              );

                              container.style.border = `1px solid red`;
                              container.style.height = `${y}px`;
                              container.style.width = `${x}px`;
                              container.style.position = `relative`;

                              const factory = createObstacleMovelViewConnectorFactory(
                                obstacleAppearance,
                                container,
                                lvl
                              );

                              return new GameBoard(
                                birdConnector,
                                factory,
                                createNewObstacleEventFactory(
                                  lvl.delay.min,
                                  lvl.delay.max
                                )
                              );
                            },
                          };
                        },
                      };
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}
