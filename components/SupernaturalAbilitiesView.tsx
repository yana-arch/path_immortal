import React, { useState, useEffect, useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { SpecialEffect } from '../types';
import { formatStones } from '../constants';

const formatCooldown = (seconds: number): string => {
    if (seconds <= 0) return "Sẵn sàng";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface EffectCardProps {
    effect: SpecialEffect;
    sourceName: string;
}

const EffectCard: React.FC<EffectCardProps> = ({ effect, sourceName }) => {
    const { gameState, activateSpecialEffect } = useGameContext();
    const [timeLeft, setTimeLeft] = useState(0);

    const cooldownEnd = gameState.effectCooldowns[effect.id] || 0;
    const canAfford = gameState.spiritStones >= effect.cost;

    useEffect(() => {
        const updateCooldown = () => {
            const now = Date.now();
            const remaining = Math.max(0, (cooldownEnd - now) / 1000);
            setTimeLeft(remaining);
        };

        updateCooldown(); // Initial check
        const interval = setInterval(updateCooldown, 1000);
        return () => clearInterval(interval);
    }, [cooldownEnd]);
    
    const isOnCooldown = timeLeft > 0;
    const isDisabled = isOnCooldown || !canAfford;

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-600 flex flex-col justify-between">
            <div>
                <h4 className="text-xl font-bold text-yellow-300">{effect.name}</h4>
                <p className="text-sm text-purple-300 mt-1">Nguồn: {sourceName} (Cấp {effect.unlockLevel})</p>
                <p className="text-sm text-gray-300 mt-2">{effect.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700 text-right">
                <button
                    onClick={() => activateSpecialEffect(effect.id)}
                    disabled={isDisabled}
                    className={`px-4 py-2 w-full rounded-md font-semibold transition-colors ${
                        isDisabled
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                >
                    {isOnCooldown ? `Hồi chiêu (${formatCooldown(timeLeft)})` : 'Thi Triển'}
                </button>
                <p className={`text-sm mt-1 ${canAfford ? 'text-gray-300' : 'text-red-400'}`}>
                    Cần: {formatStones(effect.cost)} Linh Thạch
                </p>
            </div>
        </div>
    );
};

const SupernaturalAbilitiesView: React.FC = () => {
    const { gameState } = useGameContext();

    const unlockedEffects = useMemo(() => {
        const effects: { effect: SpecialEffect, sourceName: string }[] = [];
        
        gameState.techniques.forEach(tech => {
            if (tech.level > 0 && tech.specialEffects) {
                tech.specialEffects.forEach(effect => {
                    if (tech.level >= effect.unlockLevel) {
                        effects.push({ effect, sourceName: tech.name });
                    }
                });
            }
        });

        gameState.treasures.forEach(treasure => {
            if (treasure.owned && treasure.specialEffects) {
                treasure.specialEffects.forEach(effect => {
                    if (treasure.level >= effect.unlockLevel) {
                        effects.push({ effect, sourceName: treasure.name });
                    }
                });
            }
        });

        return effects;
    }, [gameState.techniques, gameState.treasures]);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Thần Thông</h3>
            
            {unlockedEffects.length === 0 ? (
                <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400">Bạn chưa lĩnh ngộ được thần thông nào.</p>
                    <p className="text-sm text-gray-500 mt-2">Hãy nâng cấp Công Pháp và Pháp Bảo để mở khóa các năng lực đặc biệt!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unlockedEffects.map(({ effect, sourceName }) => (
                        <EffectCard key={effect.id} effect={effect} sourceName={sourceName} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupernaturalAbilitiesView;
