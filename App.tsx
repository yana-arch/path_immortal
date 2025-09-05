// Fix: Added full content for App.tsx
import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { GameProvider } from './context/GameContext';
import { ViewType } from './types';

import MainDisplay from './components/MainDisplay';
import ControlPanel from './components/ControlPanel';
import SpiritQiCollector from './components/SpiritQiCollector';
import CultivationView from './components/CultivationView';
import TreasureView from './components/TreasureView';
import EquipmentView from './components/EquipmentView';
import AlchemyView from './components/AlchemyView';
import InventoryView from './components/InventoryView';
import SupernaturalAbilitiesView from './components/SupernaturalAbilitiesView';
import ChallengeView from './components/ChallengeView';
import EventView from './components/EventView';
import SectView from './components/SectView';
import MapView from './components/MapView';
import EventDisplay from './components/EventDisplay';
import FriendsView from './components/FriendsView';
import DialogueView from './components/DialogueView';
import FriendEncounterView from './components/FriendEncounterView';
import CharacterCreation from './components/CharacterCreation';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import PavilionView from './components/PavilionView';
import DaoLuDialogueView from './components/DaoLuDialogueView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('cultivation');
  const gameStateHook = useGameState();
  const [isCharacterCreated, setIsCharacterCreated] = useState(() => !!localStorage.getItem('tu_tien_save_game'));

  useGameLoop(gameStateHook.tick);
  
  // Offline progress calculation
  useEffect(() => {
    if (!isCharacterCreated) return;
    
    const now = Date.now();
    const offlineTime = (now - gameStateHook.gameState.lastUpdate) / 1000; // in seconds
    if (offlineTime > 1) { // only calculate if offline for more than a second
        const offlineQi = gameStateHook.qiPerSecond * offlineTime;
        gameStateHook.setGameState(prev => ({
            ...prev,
            spiritQi: prev.spiritQi + offlineQi,
            lastUpdate: now,
        }));
        // Optionally, show a message to the user about offline gains
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCharacterCreated]); // Run only on initial load for existing players

  const handleCharacterCreate = (gender: 'Nam' | 'Nữ', appearance: string) => {
    gameStateHook.setGameState(prevState => ({
      ...prevState,
      gender,
      appearance,
      lastUpdate: Date.now(),
    }));
    setIsCharacterCreated(true);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'cultivation':
        return <CultivationView />;
      case 'treasures':
        return <TreasureView />;
      case 'equipment':
        return <EquipmentView />;
      case 'alchemy':
        return <AlchemyView />;
      case 'inventory':
        return <InventoryView />;
      case 'supernatural':
        return <SupernaturalAbilitiesView />;
      case 'challenges':
        return <ChallengeView />;
      case 'event':
        return <EventView />;
      case 'sect':
        return <SectView />;
      case 'map':
        return <MapView />;
      case 'friends':
        return <FriendsView />;
      case 'pavilion':
        return <PavilionView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CultivationView />;
    }
  };

  if (!isCharacterCreated) {
    return <CharacterCreation onCharacterCreate={handleCharacterCreate} />;
  }

  return (
    <GameProvider value={gameStateHook}>
      <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center bg-fixed bg-gradient-to-br from-gray-900 to-slate-900" style={{backgroundImage: "url('/background.jpg')"}}>
        <div className="container mx-auto p-4">
          <header className="text-center my-6">
            <h1 className="text-5xl font-bold text-cyan-300 text-shadow-lg">Tu Tiên Giả Lập</h1>
            <p className="text-lg text-cyan-100/80 mt-1">Từ Luyện Khí đến Thăng Tiên</p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <MainDisplay />
              <ControlPanel activeView={activeView} setActiveView={setActiveView} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              {renderActiveView()}
              {activeView === 'cultivation' && <SpiritQiCollector />}
            </div>
          </main>
        </div>
      </div>
      {gameStateHook.currentEvent && <EventDisplay event={gameStateHook.currentEvent} />}
      {gameStateHook.gameState.activeDialogue && <DialogueView />}
      {gameStateHook.gameState.activeDaoLuChat && <DaoLuDialogueView />}
      {gameStateHook.gameState.pendingFriend && <FriendEncounterView />}
    </GameProvider>
  );
};

export default App;