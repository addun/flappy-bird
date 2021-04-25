import { GameLvl } from "../models/game.model";

export function LevelBuilder() {
  return {
    setGap(gap: number) {
      return {
        setMinDelay(min: number) {
          return {
            setMaxDelay(max: number) {
              return {
                build(): GameLvl {
                  return {
                    gap,
                    delay: { min, max },
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
