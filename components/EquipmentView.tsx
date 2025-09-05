import React from 'react';
import { useGameContext } from '../context/GameContext';
import { EquipmentItem } from '../types';
import AiGenerator from './AiGenerator';
import { formatStones } from '../constants';

const EquipmentView: React.FC = () => {
    const { gameState, upgradeEquipment, equipItem, generateAiContent } = useGameContext();

    const getUpgradeCost = (item: EquipmentItem) => {
        return item.baseCost * Math.pow(item.costMultiplier, item.level - 1);
    }

    const handleGenerate = (prompt: string) => {
        return generateAiContent('equipment', prompt);
    };

    const generationCost = 100 * (1 + gameState.realmLevel * 0.5);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Trang Bị</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {gameState.equipment.map(item => {
                        const upgradeCost = getUpgradeCost(item);
                        const canAffordUpgrade = gameState.spiritStones >= upgradeCost;
                        const isEquipped = gameState.equipped[item.slot] === item.id;
                        
                        return (
                            <div key={item.id} className={`p-4 bg-gray-800/50 rounded-lg border ${isEquipped ? 'border-yellow-400' : 'border-gray-600'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xl font-bold text-yellow-300">{item.name} (Cấp {item.level})</h4>
                                        <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                                        <p className="text-sm text-cyan-300 mt-1">Tăng tu luyện: +{(item.level * item.bonusMultiplier * 100).toFixed(2)}%</p>
                                    </div>
                                    <div className="text-right flex flex-col gap-2 items-end">
                                        <button
                                            onClick={() => upgradeEquipment(item.id)}
                                            disabled={!canAffordUpgrade}
                                            className={`px-4 py-2 rounded-md font-semibold transition-colors w-32 ${
                                                canAffordUpgrade ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Cường Hóa
                                        </button>
                                        <p className={`text-sm ${canAffordUpgrade ? 'text-gray-300' : 'text-red-400'}`}>
                                            Cần: {formatStones(upgradeCost)} Linh Thạch
                                        </p>
                                        <button
                                            onClick={() => equipItem(item)}
                                            disabled={isEquipped}
                                            className={`px-4 py-2 rounded-md font-semibold transition-colors w-32 ${
                                                !isEquipped ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isEquipped ? 'Đã Trang Bị' : 'Trang Bị'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <AiGenerator
                title="Luyện Chế Thần Binh"
                description="Mô tả một món trang bị hoặc pháp khí bạn muốn sở hữu, Thiên Cơ sẽ giúp bạn luyện chế."
                placeholder="Ví dụ: một chiếc áo choàng tàng hình, một thanh phi kiếm bằng băng..."
                onGenerate={handleGenerate}
                cost={generationCost}
                currentBalance={gameState.spiritStones}
                currencyName="Linh Thạch"
            />
        </div>
    );
};

export default EquipmentView;