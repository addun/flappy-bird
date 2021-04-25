import { Observable, interval, timer } from "rxjs";
import { switchMap, mapTo } from "rxjs/operators";

export function createNewObstacleEventFactory(
  min: number,
  max: number
): () => Observable<void> {
  return () =>
    interval(min).pipe(
      switchMap(() => {
        const range = Math.floor(Math.random() * (max - min));
        return timer(range);
      }),
      mapTo(void 0)
    );
}
