import React from 'react';
import { useGameContext } from '../context/GameContext';
import { MagicTreasure } from '../types';
import { formatStones, formatQi } from '../constants';

const TreasureView: React.FC = () => {
    const { gameState, buyTreasure, upgradeTreasure } = useGameContext();
    
    const getUpgradeCost = (treasure: MagicTreasure) => {
        return treasure.upgradeCostBase * Math.pow(treasure.upgradeCostMultiplier, treasure.level - 1);
    }
    
    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Pháp Bảo</h3>
            <div className="space-y-4">
                {gameState.treasures.map(treasure => {
                    const upgradeCost = getUpgradeCost(treasure);
                    const canAffordBuy = gameState.spiritStones >= treasure.baseCost;
                    const canAffordUpgrade = gameState.spiritStones >= upgradeCost;
                    
                    return (
                        <div key={treasure.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-bold text-yellow-300">{treasure.name} {treasure.owned ? `(Cấp ${treasure.level})` : ''}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{treasure.description}</p>
                                    {treasure.owned && <p className="text-sm text-cyan-300 mt-1">Linh khí cộng thêm: +{formatQi(treasure.baseQiBonus + (treasure.level - 1) * treasure.bonusPerLevel)}/giây</p>}
                                </div>
                                <div className="text-right">
                                    {!treasure.owned ? (
                                        <>
                                            <button
                                                onClick={() => buyTreasure(treasure.id)}
                                                disabled={!canAffordBuy}
                                                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                                                    canAffordBuy ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                Mua
                                            </button>
                                            <p className={`text-sm mt-1 ${canAffordBuy ? 'text-gray-300' : 'text-red-400'}`}>
                                                Cần: {formatStones(treasure.baseCost)} Linh Thạch
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => upgradeTreasure(treasure.id)}
                                                disabled={!canAffordUpgrade}
                                                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                                                    canAffordUpgrade ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                Nâng Cấp
                                            </button>
                                            <p className={`text-sm mt-1 ${canAffordUpgrade ? 'text-gray-300' : 'text-red-400'}`}>
                                                Cần: {formatStones(upgradeCost)} Linh Thạch
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {treasure.owned && treasure.specialEffects && treasure.specialEffects.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-sm font-semibold text-purple-300 mb-1">Thần Thông có thể lĩnh ngộ:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                        {treasure.specialEffects.map(effect => (
                                            <li key={effect.id} className={treasure.level >= effect.unlockLevel ? 'text-green-300' : 'text-gray-400'}>
                                                Cấp {effect.unlockLevel}: Mở khóa <strong>{effect.name}</strong>.
                                                <span className="italic"> {treasure.level >= effect.unlockLevel ? '(Đã mở khóa)' : ''}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TreasureView;