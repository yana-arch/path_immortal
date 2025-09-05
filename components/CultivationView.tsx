

import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Technique, GameState, Prerequisite } from '../types';
import { formatQi, REALMS } from '../constants';

// Helper function to check prerequisites and return reasons for display
const checkPrerequisitesMet = (tech: Technique, gameState: GameState): { met: boolean; reasons: string[] } => {
    if (!tech.prerequisites) return { met: true, reasons: [] };

    const reasons: string[] = [];
    let allMet = true;

    for (const prereq of tech.prerequisites) {
        let currentMet = false;
        if (prereq.type === 'realm') {
            if (gameState.realmLevel >= prereq.level) {
                currentMet = true;
            } else {
                reasons.push(`Cần đạt cảnh giới ${REALMS[prereq.level]?.name || 'không xác định'}.`);
            }
        } else if (prereq.type === 'technique') {
            const requiredTech = gameState.techniques.find(t => t.id === prereq.id);
            if (requiredTech && requiredTech.level >= prereq.level) {
                currentMet = true;
            } else {
                const requiredTechName = gameState.techniques.find(t => t.id === prereq.id)?.name || 'công pháp bí ẩn';
                reasons.push(`Cần ${requiredTechName} đạt cấp ${prereq.level}.`);
            }
        }
        if (!currentMet) {
            allMet = false;
        }
    }
    return { met: allMet, reasons };
};

const CultivationView: React.FC = () => {
    const { gameState, upgradeTechnique } = useGameContext();

    const getUpgradeCost = (tech: Technique) => {
        return tech.baseCost * Math.pow(tech.costMultiplier, tech.level);
    };

    const allTechniques = [...gameState.techniques].sort((a, b) => a.baseCost - b.baseCost);

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Công Pháp</h3>
            <div className="space-y-4">
                {allTechniques.map(tech => {
                    const upgradeCost = getUpgradeCost(tech);
                    const canAfford = gameState.spiritQi >= upgradeCost;
                    const prereqStatus = checkPrerequisitesMet(tech, gameState);
                    
                    const isLocked = tech.level === 0 && !prereqStatus.met;
                    const canLearn = tech.level === 0 && prereqStatus.met;

                    const buttonText = tech.level === 0 ? 'Lĩnh Ngộ' : 'Nâng Cấp';
                    const isDisabled = isLocked || !canAfford;
                    
                    return (
                        <div key={tech.id} className={`p-4 bg-gray-800/50 rounded-lg border transition-all duration-300 ${isLocked ? 'border-gray-700 opacity-60' : canLearn ? 'border-yellow-400 animate-pulse-slow' : 'border-gray-600'}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className={`text-xl font-bold ${isLocked ? 'text-gray-400' : 'text-yellow-300'}`}>{tech.name} {tech.level > 0 && `(Cấp ${tech.level})`}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{tech.description}</p>
                                    {tech.level > 0 && <p className="text-sm text-cyan-300 mt-1">Linh khí cộng thêm: +{formatQi(tech.qiBonusPerLevel * tech.level)}/giây</p>}
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <button
                                        onClick={() => upgradeTechnique(tech.id)}
                                        disabled={isDisabled}
                                        className={`px-4 py-2 w-32 rounded-md font-semibold transition-colors ${
                                            isDisabled ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                                            canLearn ? 'bg-green-600 hover:bg-green-500 text-white' :
                                            'bg-blue-600 hover:bg-blue-500 text-white'
                                        }`}
                                    >
                                        {buttonText}
                                    </button>
                                    <p className={`text-sm mt-1 ${canAfford ? 'text-gray-300' : 'text-red-400'}`}>
                                        Cần: {formatQi(upgradeCost)} Linh Khí
                                    </p>
                                </div>
                            </div>
                            {isLocked && (
                                <div className="mt-3 p-3 bg-black/40 rounded-md border-l-4 border-red-500">
                                    <p className="text-sm font-semibold text-yellow-300 mb-1">Yêu cầu lĩnh ngộ:</p>
                                    <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                                        {prereqStatus.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                                    </ul>
                                </div>
                            )}
                             {tech.specialEffects && tech.specialEffects.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-sm font-semibold text-purple-300 mb-1">Thần Thông có thể lĩnh ngộ:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                        {tech.specialEffects.map(effect => (
                                            <li key={effect.id} className={tech.level >= effect.unlockLevel ? 'text-green-300' : 'text-gray-400'}>
                                                Cấp {effect.unlockLevel}: Mở khóa <strong>{effect.name}</strong>.
                                                <span className="italic"> {tech.level >= effect.unlockLevel ? '(Đã mở khóa)' : ''}</span>
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

export default CultivationView;