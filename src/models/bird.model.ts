import {
  BehaviorSubject,
  Subscription,
  merge,
  fromEvent,
  interval,
} from "rxjs";
import { filter, tap } from "rxjs/operators";

export class Bird {
  x$ = new BehaviorSubject<number>(0);
  y$ = new BehaviorSubject<number>(0);

  private gravity = 0.07;
  private speed = 0;
  private jump = 1.2;

  fly() {
    this.speed = -this.jump;
  }

  fall() {
    let newYPosition = this.y$.getValue() + this.speed;

    if (newYPosition < 0) {
      newYPosition = 0;
    } else if (newYPosition > 100) {
      newYPosition = 100;
    }

    this.speed += this.gravity;
    this.y$.next(newYPosition);
  }
}

export class BirdModelViewConnector {
  private sub = new Subscription();

  birdAppearance: HTMLElement;

  constructor(
    public bird: Bird,
    orginalBirdAppearance: HTMLElement,
    private board: HTMLElement
  ) {
    this.birdAppearance = orginalBirdAppearance.cloneNode(true) as HTMLElement;
  }

  start() {
    this.birdAppearance.style.transformOrigin = `transform-origin: center;`;
    this.birdAppearance.style.position = "absolute";

    this.board.appendChild(this.birdAppearance);

    this.sub.unsubscribe();
    this.sub = merge(
      fromEvent<KeyboardEvent>(document, "keydown").pipe(
        tap(() => this.bird.fly())
      ),
      interval(17).pipe(tap(() => this.bird.fall())),
      this.bird.y$.pipe(
        tap((y) => {
          this.birdAppearance.style.transform = `rotate(${y}deg)`;
          this.birdAppearance.style.top = `calc(${y}% - ${this.birdAppearance.clientHeight}px)`;
        })
      ),
      this.bird.x$.pipe(tap((x) => (this.birdAppearance.style.left = `${x}%`)))
    ).subscribe();
  }

  stop() {
    this.sub.unsubscribe();
  }
}
