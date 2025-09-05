import React from 'react';
import { useGameContext } from '../context/GameContext';

const BuffDisplay: React.FC = () => {
    const { gameState } = useGameContext();

    if (gameState.activeBuffs.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <h4 className="text-lg font-bold text-cyan-200 mb-2 text-center">Hiệu ứng</h4>
            <div className="flex flex-col gap-2">
                {gameState.activeBuffs.map(buff => (
                    <div key={buff.elixirId} className="bg-purple-900/50 p-2 rounded-md text-sm">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-yellow-300">{buff.name}</span>
                            <span className="text-gray-300">{Math.ceil(buff.timeLeft)}s</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuffDisplay;
