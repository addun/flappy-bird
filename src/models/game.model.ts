import { BehaviorSubject, Observable } from "rxjs";
import { filter, take, tap } from "rxjs/operators";
import { BirdModelViewConnector } from "./bird.model";
import { ObstacleMovelViewConnector } from "./obstacle.model";

export class GameBoard {
  points$ = new BehaviorSubject<number>(0);

  constructor(
    private birdConnector: BirdModelViewConnector,
    private obstacleMovelViewConnectorFactory: () => ObstacleMovelViewConnector,
    private newObstacleEventFactory: () => Observable<void>
  ) {}

  start() {
    this.birdConnector.start();

    const connectors: ObstacleMovelViewConnector[] = [];

    const delaySub = this.newObstacleEventFactory().subscribe(() => {
      const obstacle = this.obstacleMovelViewConnectorFactory();

      obstacle.start();
      connectors.push(obstacle);

      obstacle.obstacle.x$
        .pipe(
          filter((x) => x === 100),
          take(1),
          tap(() => this.addPoint()),
          tap((x) => obstacle.remove()),
          tap((x) => obstacle.stop())
        )
        .subscribe();

      obstacle.obstacle.x$
        .pipe(
          filter(
            (x) =>
              elementsOverlap(
                obstacle.top,
                this.birdConnector.birdAppearance
              ) ||
              elementsOverlap(
                obstacle.bottom,
                this.birdConnector.birdAppearance
              )
          )
        )
        .subscribe(() => {
          this.birdConnector.stop();
          delaySub.unsubscribe();
          connectors.forEach((c) => c.stop());
          this.points$.complete();
        });
    });
  }

  private addPoint() {
    this.points$.next(this.points$.getValue() + 1);
  }
}

export interface GameLvl {
  gap: number;
  delay: {
    min: number;
    max: number;
  };
}

function elementsOverlap(el1: HTMLElement, el2: HTMLElement): boolean {
  const box1 = el1.getBoundingClientRect();
  const box2 = el2.getBoundingClientRect();

  const a = {
    x1: box1.x,
    x2: box1.x + box1.width,
    y1: box1.y,
    y2: box1.y + box1.height,
  };

  const b = {
    x1: box2.x,
    x2: box2.x + box2.width,
    y1: box2.y,
    y2: box2.y + box2.height,
  };

  // no horizontal overlap
  if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

  // no vertical overlap
  if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

  return true;
}
