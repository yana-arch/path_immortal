import { useEffect } from 'react';

const TICK_RATE = 100; // ms per tick, 10 times a second

export const useGameLoop = (tick: (deltaTime: number) => void) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      tick(TICK_RATE / 1000);
    }, TICK_RATE);

    return () => clearInterval(intervalId);
  }, [tick]);
};