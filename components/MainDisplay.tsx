// Fix: Added full content for components/MainDisplay.tsx
import React from 'react';
import { useGameContext } from '../context/GameContext';
import BuffDisplay from './BuffDisplay';
import { formatQi, formatStones } from '../constants';

const StatRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; valueColor?: string }> = ({ icon, label, value, valueColor = 'text-white' }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-gray-300">{label}:</span>
        </div>
        <span className={`font-bold ${valueColor}`}>{value}</span>
    </div>
);


const MainDisplay: React.FC = () => {
    const { gameState, qiPerSecond } = useGameContext();
    const daoLus = gameState.friends.filter(f => gameState.daoLuIds.includes(f.id));

    return (
        <div className="p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-center text-cyan-300 text-shadow pb-2 border-b border-cyan-800/50">Trạng Thái Tu Sĩ</h3>
            <div className="space-y-3 text-lg">
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.59 7.41l-1.06-1.06a1 1 0 00-1.42 0L12 12.42 5.88 6.35a1 1 0 00-1.42 0l-1.06 1.06a1 1 0 000 1.42l6.07 6.07a1 1 0 001.42 0l6.07-6.07a1 1 0 000-1.42z" /></svg>}
                    label="Cảnh Giới"
                    value={gameState.realm}
                    valueColor="text-yellow-300"
                />
                 <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.5 15.5c5-5 5-11 0-16m17 16c-5-5-5-11 0-16" /></svg>}
                    label="Linh Khí"
                    value={formatQi(gameState.spiritQi)}
                    valueColor="text-cyan-200"
                />
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                    label="Linh Thạch"
                    value={formatStones(gameState.spiritStones)}
                    valueColor="text-yellow-400"
                />
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    label="Tốc Độ"
                    value={`+${formatQi(qiPerSecond)}/giây`}
                    valueColor="text-green-400"
                />

                <hr className="border-gray-600 my-2"/>
                
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    label="Tuổi Tác"
                    value={gameState.age.toFixed(0)}
                />
                 <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Tuổi Thọ"
                    value={`${gameState.age.toFixed(0)} / ${gameState.lifespan}`}
                    valueColor={gameState.age > gameState.lifespan ? 'text-red-500 animate-pulse' : 'text-white'}
                />
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                    label="Khí Huyết"
                    value={gameState.qiAndBlood.toFixed(0)}
                    valueColor="text-red-400"
                />
                <StatRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    label="Thông Tin"
                    value={`${gameState.gender} - ${gameState.appearance}`}
                />
                
                {daoLus.length > 0 && (
                    <div className="pt-2 border-t border-gray-700 mt-2">
                        <StatRow
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                            label="Đạo Lữ"
                            value={daoLus.map(d => d.name).join(', ')}
                            valueColor="text-rose-300"
                        />
                    </div>
                )}
            </div>
            <BuffDisplay />
        </div>
    );
};

export default MainDisplay;