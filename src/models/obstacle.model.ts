import { BehaviorSubject, interval, merge, Subscription } from "rxjs";
import { tap } from "rxjs/operators";

export class Obstacle {
  x$ = new BehaviorSubject<number>(0);
  y$ = new BehaviorSubject<number>(0);

  incrementX() {
    let newValue = this.x$.getValue() + 0.3;
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 100) {
      newValue = 100;
    }

    this.x$.next(newValue);
  }
}

export class ObstacleMovelViewConnector {
  private sub = new Subscription();
  top!: HTMLElement;
  bottom!: HTMLElement;

  constructor(
    public obstacle: Obstacle,
    public obstacleAppearance: HTMLElement,
    public board: HTMLElement,
    private gap: number
  ) {}

  start() {
    this.top = this.obstacleAppearance.cloneNode(true) as HTMLElement;
    this.bottom = this.obstacleAppearance.cloneNode(true) as HTMLElement;

    this.board.appendChild(this.top);
    this.board.appendChild(this.bottom);

    this.top.style.transformOrigin = `transform-origin: center;`;
    this.top.style.position = "absolute";
    this.top.style.top = `0%`;
    this.top.style.transform = `rotate(180deg)`;

    this.bottom.style.transformOrigin = `transform-origin: center;`;
    this.bottom.style.position = "absolute";
    this.bottom.style.top = `100%`;
    this.bottom.style.transform = `rotate(0deg)`;

    const topHeight = Math.floor(Math.random() * (100 - this.gap));
    this.top.style.height = `${topHeight}%`;
    this.bottom.style.height = `${100 - topHeight - this.gap}%`;
    this.bottom.style.top = `${topHeight + this.gap}%`;

    this.sub.unsubscribe();
    this.sub = merge(
      interval(17).pipe(tap(() => this.obstacle.incrementX())),
      this.obstacle.x$.pipe(
        tap((x) => (this.top.style.left = `${100 - x}%`)),
        tap((x) => (this.bottom.style.left = `${100 - x}%`))
      )
    ).subscribe();
  }

  stop() {
    this.sub.unsubscribe();
  }

  remove() {
    this.board.removeChild(this.top);
    this.board.removeChild(this.bottom);
  }
}
