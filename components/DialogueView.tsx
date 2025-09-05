import React from 'react';
import { useGameContext } from '../context/GameContext';

const DialogueView: React.FC = () => {
  const { gameState, closeDialogue } = useGameContext();
  const { activeDialogue } = gameState;

  if (!activeDialogue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 max-w-lg w-full item-shadow text-white mx-4 relative">
        <h2 className="text-2xl font-bold text-yellow-300 text-shadow mb-4">Hội thoại với {activeDialogue.friendName}</h2>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap text-lg italic">"{activeDialogue.content}"</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={closeDialogue}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Kết thúc
            </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueView;