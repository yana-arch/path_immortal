import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { PavilionItem, PavilionCharacter, ElixirEffectType } from '../types';
import { formatStones } from '../constants';

const PavilionView: React.FC = () => {
    const { gameState, refreshPavilion, buyPavilionItem, interactWithPavilionCharacter } = useGameContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { pavilionState, spiritStones } = gameState;

    useEffect(() => {
        // Automatically refresh when visiting for the first time
        if (!pavilionState) {
            handleRefresh();
        }
    }, [pavilionState]);

    const handleRefresh = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await refreshPavilion();
        } catch (e: any) {
            setError(e.message || 'Làm mới thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshCost = 50;
    const canAffordRefresh = spiritStones >= refreshCost;

    const renderEffect = (item: PavilionItem) => {
        const { effect } = item;
        const { buffDetails } = effect;
        const sign = buffDetails.value > 0 ? '+' : '';
        if (buffDetails.effectType === ElixirEffectType.MULTIPLICATION) {
            return `${sign}${(buffDetails.value * 100).toFixed(0)}% tốc độ tu luyện`;
        }
        return `${sign}${buffDetails.value} Linh Khí/giây`;
    };

    if (isLoading && !pavilionState) {
        return (
            <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-300"></div>
                <p className="mt-4 text-lg">Đang kết nối với Túy Tiên Lâu...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <div className="pb-2 border-b border-cyan-800/50">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow">Túy Tiên Lâu</h3>
                        <p className="text-lg text-cyan-100/80 italic text-center">"Nơi tiên nhân hội tụ, luận đạo thưởng rượu."</p>
                    </div>
                    <div className="text-right">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading || !canAffordRefresh}
                            className="px-4 py-2 rounded-md font-semibold transition-colors bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang làm mới...' : 'Làm Mới'}
                        </button>
                        <p className={`text-sm mt-1 ${canAffordRefresh ? 'text-gray-400' : 'text-red-400'}`}>
                            Cần: {formatStones(refreshCost)} LT
                        </p>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-400 text-center bg-red-900/50 p-2 rounded">{error}</p>}
            
            {pavilionState && (
                <div className="space-y-6">
                    {/* Scene Description */}
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <p className="text-center text-lg italic text-yellow-200">"{pavilionState.description}"</p>
                    </div>

                    {/* Items for Sale */}
                    <div>
                        <h4 className="text-xl font-bold text-yellow-300 mb-3">Tiên Tửu & Kỳ Trân</h4>
                        <div className="space-y-3">
                            {pavilionState.items.length > 0 ? pavilionState.items.map(item => {
                                const canAfford = spiritStones >= item.cost;
                                return (
                                    <div key={item.id} className="p-3 bg-gray-900/50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg">{item.name}</p>
                                            <p className="text-sm text-gray-300">{item.description}</p>
                                            <p className="text-sm text-cyan-300">Hiệu quả: {renderEffect(item)} trong {item.effect.buffDetails.duration}s</p>
                                        </div>
                                        <div className="text-right">
                                            <button 
                                                onClick={() => buyPavilionItem(item.id)}
                                                disabled={!canAfford}
                                                className="px-4 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
                                            >
                                                Mua
                                            </button>
                                            <p className={`text-sm mt-1 ${canAfford ? 'text-gray-400' : 'text-red-400'}`}>{formatStones(item.cost)} LT</p>
                                        </div>
                                    </div>
                                );
                            }) : <p className="text-gray-400 italic">Hôm nay không có vật phẩm đặc biệt nào.</p>}
                        </div>
                    </div>

                    {/* Characters */}
                    <div>
                        <h4 className="text-xl font-bold text-yellow-300 mb-3">Khách Nhân Trong Lầu</h4>
                         <div className="space-y-3">
                            {pavilionState.characters.length > 0 ? pavilionState.characters.map(char => {
                                 const canAfford = spiritStones >= char.interactionCost;
                                return (
                                    <div key={char.id} className="p-3 bg-gray-900/50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg">{char.name} <span className="text-sm text-cyan-400">({char.realm})</span></p>
                                            <p className="text-sm text-gray-300">{char.background}</p>
                                        </div>
                                         <div className="text-right">
                                            <button 
                                                onClick={() => interactWithPavilionCharacter(char.id)}
                                                disabled={!canAfford}
                                                className="px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
                                            >
                                                Mời Rượu
                                            </button>
                                            <p className={`text-sm mt-1 ${canAfford ? 'text-gray-400' : 'text-red-400'}`}>{formatStones(char.interactionCost)} LT</p>
                                        </div>
                                    </div>
                                );
                            }) : <p className="text-gray-400 italic">Trong lầu hiện đang vắng vẻ.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PavilionView;