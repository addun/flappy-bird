import { GameLvl } from "../models/game.model";
import { Obstacle, ObstacleMovelViewConnector } from "../models/obstacle.model";

export function createObstacleMovelViewConnectorFactory(
  onstacleAppearance: HTMLElement,
  container: HTMLElement,
  lvl: GameLvl
): () => ObstacleMovelViewConnector {
  return () => {
    const obstacleMovelViewConnector = new ObstacleMovelViewConnector(
      new Obstacle(),
      onstacleAppearance,
      container,
      lvl.gap
    );

    return obstacleMovelViewConnector;
  };
}
