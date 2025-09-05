import React from 'react';
import { useGameContext } from '../context/GameContext';
import AiGenerator from './AiGenerator';
import { Challenge } from '../types';
import { formatNumber } from '../constants';

const isChallengeCompleted = (challenge: Challenge, gameState: any, qiPerSecond: number): boolean => {
    const { type, value } = challenge.completionCondition;
    switch (type) {
        case 'qi_per_second': return qiPerSecond >= value;
        case 'total_qi': return gameState.spiritQi >= value;
        case 'realm_level': return gameState.realmLevel >= value;
        default: return false;
    }
};

const ChallengeView: React.FC = () => {
    const { gameState, claimChallengeReward, qiPerSecond, generateAiContent } = useGameContext();

    const handleGenerate = (prompt: string) => {
        return generateAiContent('challenge', prompt);
    };

    const generationCost = 50 * (1 + gameState.realmLevel * 0.5);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Thử Thách</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {gameState.challenges.map(challenge => {
                        const state = gameState.challengeStates.find(cs => cs.id === challenge.id);
                        const isClaimed = state?.isClaimed || false;
                        const isCompleted = !isClaimed && isChallengeCompleted(challenge, gameState, qiPerSecond);

                        let statusText = "Đang tiến hành";
                        let statusColor = "text-yellow-400";

                        if (isClaimed) {
                            statusText = "Đã hoàn thành";
                            statusColor = "text-green-400";
                        } else if (isCompleted) {
                            statusText = "Có thể nhận thưởng";
                            statusColor = "text-cyan-400 animate-pulse";
                        }
                        
                        const rewardText = `${formatNumber(challenge.reward.qi)} Linh Khí` + (challenge.reward.stones ? ` & ${formatNumber(challenge.reward.stones)} Linh Thạch` : '');

                        return (
                            <div key={challenge.id} className={`p-4 bg-gray-800/50 rounded-lg border ${isCompleted && !isClaimed ? 'border-cyan-500' : 'border-gray-600'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xl font-bold text-yellow-300">{challenge.name}</h4>
                                        <p className="text-sm text-gray-300 mt-1">{challenge.description}</p>
                                        <p className="text-sm text-green-300 mt-1">Phần thưởng: {rewardText}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => claimChallengeReward(challenge.id)}
                                            disabled={!isCompleted || isClaimed}
                                            className={`px-4 py-2 w-40 rounded-md font-semibold transition-colors ${
                                                isCompleted && !isClaimed ? 'bg-green-600 hover:bg-green-500 text-white' : 
                                                isClaimed ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
                                                'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isClaimed ? 'Đã Nhận' : 'Nhận Thưởng'}
                                        </button>
                                        <p className={`text-sm font-semibold ${statusColor}`}>{statusText}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <AiGenerator
                title="Diễn Toán Thiên Cơ"
                description="Dùng Linh Thạch để diễn toán thiên cơ, tạo ra một thử thách mới phù hợp với con đường tu tiên của bạn."
                placeholder="Ví dụ: tạo thử thách về việc luyện thể, hoặc thử thách vượt qua tâm ma..."
                onGenerate={handleGenerate}
                cost={generationCost}
                currentBalance={gameState.spiritStones}
                currencyName="Linh Thạch"
            />
        </div>
    );
};

export default ChallengeView;