import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import AiGenerator from './AiGenerator';
import { formatStones } from '../constants';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MapView: React.FC = () => {
    const { gameState, startTravel, generateAiContent } = useGameContext();
    const { currentLocationId, travelDestinationId, travelCompletionTime, spiritStones, mapLocations } = gameState;
    const [timeLeft, setTimeLeft] = useState(0);

    const currentLocation = mapLocations.find(loc => loc.id === currentLocationId)!;
    const destination = travelDestinationId ? mapLocations.find(loc => loc.id === travelDestinationId) : null;

    useEffect(() => {
        if (!travelCompletionTime) {
            setTimeLeft(0);
            return;
        }
        const interval = setInterval(() => {
            const remaining = (travelCompletionTime - Date.now()) / 1000;
            setTimeLeft(Math.max(0, remaining));
        }, 1000);
        return () => clearInterval(interval);
    }, [travelCompletionTime]);
    
    const handleGenerate = (prompt: string) => {
        return generateAiContent('location', prompt);
    };
    
    const generationCost = 150 * (1 + gameState.realmLevel * 0.5);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-2 pb-2 border-b border-cyan-800/50">Thế Giới Tu Tiên</h3>
            
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 text-center">
                {destination ? (
                    <>
                        <p className="text-lg text-yellow-300">Đang di chuyển đến:</p>
                        <p className="text-2xl font-bold">{destination.name}</p>
                        <p className="text-xl font-mono my-2 text-cyan-300 animate-pulse">{formatTime(timeLeft)}</p>
                    </>
                ) : (
                     <>
                        <p className="text-lg text-yellow-300">Vị trí hiện tại:</p>
                        <p className="text-2xl font-bold">{currentLocation.name}</p>
                        <p className="text-cyan-300 mt-1">{currentLocation.effect ? `Hiệu ứng: ${currentLocation.effect.description}` : 'Không có hiệu ứng đặc biệt'}</p>
                    </>
                )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {mapLocations.map(location => {
                    const isCurrent = location.id === currentLocationId;
                    const canAfford = spiritStones >= location.travelCost;
                    const isTraveling = !!travelDestinationId;

                    return (
                         <div key={location.id} className={`p-4 bg-gray-900/50 rounded-lg border ${isCurrent ? 'border-yellow-400' : 'border-gray-700'}`}>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="mb-3 sm:mb-0">
                                    <h4 className="text-xl font-bold text-yellow-300 flex items-center">{location.name} {isCurrent && <span className="ml-2 text-xs font-normal bg-yellow-600 text-white px-2 py-1 rounded-full">Hiện tại</span>}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{location.description}</p>
                                    <p className="text-sm text-cyan-300 mt-1">{location.effect ? `Hiệu ứng: ${location.effect.description}` : ''}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    {!isCurrent && (
                                        <>
                                            <button
                                                onClick={() => startTravel(location.id)}
                                                disabled={isTraveling || !canAfford}
                                                className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                                                    isTraveling || !canAfford ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'
                                                }`}
                                            >
                                                Du Lịch
                                            </button>
                                            <p className={`text-sm mt-1 ${canAfford || isTraveling ? 'text-gray-400' : 'text-red-400'}`}>
                                                Phí: {formatStones(location.travelCost)} LT | Thời gian: {formatTime(location.travelTime)}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AiGenerator
                title="Khám Phá Vùng Đất Mới"
                description="Mô tả một địa danh bạn muốn khám phá, Thiên Cơ sẽ biến nó thành hiện thực."
                placeholder="Ví dụ: một thành phố bay trên mây, một thung lũng dung nham..."
                onGenerate={handleGenerate}
                cost={generationCost}
                currentBalance={gameState.spiritStones}
                currencyName="Linh Thạch"
            />
        </div>
    );
};

export default MapView;