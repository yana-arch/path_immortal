
import React, { createContext, useContext, ReactNode } from 'react';
import { GameContextType } from '../types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
  value: GameContextType;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, value }) => {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
