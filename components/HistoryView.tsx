import React from 'react';
import { useGameContext } from '../context/GameContext';

const HistoryView: React.FC = () => {
    const { gameState } = useGameContext();

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Nhật Ký Tu Tiên</h3>
            <div className="p-4 bg-gray-900/70 rounded-lg h-[600px] overflow-y-auto border border-gray-700">
                {gameState.history.length > 0 ? (
                    [...gameState.history].reverse().map((entry, index) => (
                        <div key={index} className="mb-4 border-b border-gray-800 pb-4 last:border-b-0 last:mb-0">
                            <p className="text-sm text-cyan-300 font-mono">
                                {new Date(entry.timestamp).toLocaleString('vi-VN')}
                            </p>
                            <p className="text-lg text-gray-200 mt-1">
                                {entry.message}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-8">Chưa có sự kiện trọng đại nào xảy ra trên con đường tu tiên của bạn.</p>
                )}
            </div>
        </div>
    );
};

export default HistoryView;