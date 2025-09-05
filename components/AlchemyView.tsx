import React from 'react';
import { useGameContext } from '../context/GameContext';
import { ElixirEffectType } from '../types';
import AiGenerator from './AiGenerator';
import { formatStones } from '../constants';

const AlchemyView: React.FC = () => {
    const { gameState, craftElixir, generateAiContent } = useGameContext();

    const handleGenerate = (prompt: string) => {
        return generateAiContent('elixir', prompt);
    };

    const generationCost = 75 * (1 + gameState.realmLevel * 0.5);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Luyện Đan</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {gameState.elixirs.map(elixir => {
                        const canAfford = gameState.spiritStones >= elixir.cost;
                        const effectText = elixir.effect.type === ElixirEffectType.ADDITIVE 
                            ? `+${elixir.effect.value} Linh Khí/giây` 
                            : `+${elixir.effect.value * 100}% Tốc độ tu luyện`;
                        
                        return (
                            <div key={elixir.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xl font-bold text-yellow-300">{elixir.name}</h4>
                                        <p className="text-sm text-gray-300 mt-1">{elixir.description}</p>
                                        <p className="text-sm text-cyan-300 mt-1">Hiệu quả: {effectText} trong {elixir.duration} giây.</p>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={() => craftElixir(elixir.id)}
                                            disabled={!canAfford}
                                            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                                                !canAfford ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                                                'bg-purple-600 hover:bg-purple-500 text-white'
                                            }`}
                                        >
                                            Luyện Chế
                                        </button>
                                        <p className={`text-sm mt-1 ${canAfford ? 'text-gray-300' : 'text-red-400'}`}>
                                            Cần: {formatStones(elixir.cost)} Linh Thạch
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
             <AiGenerator
                title="Diễn Toán Đan Phương"
                description="Mô tả công dụng của một loại đan dược bạn muốn, Thiên Cơ sẽ giúp bạn sáng tạo ra công thức."
                placeholder="Ví dụ: một viên đan giúp tăng ngộ tính, linh dược chữa trị thương thế..."
                onGenerate={handleGenerate}
                cost={generationCost}
                currentBalance={gameState.spiritStones}
                currencyName="Linh Thạch"
            />
        </div>
    );
};

export default AlchemyView;