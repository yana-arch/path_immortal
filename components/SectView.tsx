import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Sect, SectRank } from '../types';
import AiGenerator from './AiGenerator';
import { formatNumber } from '../constants';

type SectViewTab = 'main' | 'missions' | 'treasury' | 'scenery';

const SectView: React.FC = () => {
    const { gameState, joinSect, contributeToSect, startSectMission, generateAiContent, generateSectScenery, buySectItem } = useGameContext();
    const [activeTab, setActiveTab] = useState<SectViewTab>('main');

    if (!gameState.playerSect) {
        return <JoinSectView 
            sects={gameState.sects} 
            onJoin={joinSect} 
            onGenerate={prompt => generateAiContent('sect', prompt)}
            generationCost={250 * (1 + gameState.realmLevel * 0.5)}
            currentBalance={gameState.spiritStones}
        />;
    }

    const currentSect = gameState.sects.find(s => s.id === gameState.playerSect);
    if (!currentSect) {
        return <div>Lỗi: Không tìm thấy thông tin Tông Môn.</div>;
    }

    const currentRankInfo = [...currentSect.ranks].reverse().find(r => gameState.sectContribution >= r.contributionRequired);
    const currentRankIndex = currentSect.ranks.findIndex(r => r.name === currentRankInfo?.name);
    const canAccessScenery = currentRankIndex >= 1;

    const tabBaseClass = "px-4 py-2 rounded-t-lg font-semibold transition-colors text-lg flex-grow text-center";
    const tabActiveClass = "bg-gray-800/50 text-yellow-300 border-b-2 border-yellow-400";
    const tabInactiveClass = "bg-black/40 text-cyan-200 hover:bg-gray-800/40";

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-4">
            <div>
                <h3 className="text-3xl font-bold text-center text-cyan-300 text-shadow mb-1">{currentSect.name}</h3>
                <p className="text-center text-gray-400 italic mb-4">{currentSect.description}</p>
            </div>
            
            <div className="flex border-b-2 border-cyan-800/50">
                <button onClick={() => setActiveTab('main')} className={`${tabBaseClass} ${activeTab === 'main' ? tabActiveClass : tabInactiveClass}`}>Chính Điện</button>
                <button onClick={() => setActiveTab('missions')} className={`${tabBaseClass} ${activeTab === 'missions' ? tabActiveClass : tabInactiveClass}`}>Nhiệm Vụ</button>
                <button onClick={() => setActiveTab('treasury')} className={`${tabBaseClass} ${activeTab === 'treasury' ? tabActiveClass : tabInactiveClass}`}>Trân Bảo Các</button>
                {canAccessScenery && <button onClick={() => setActiveTab('scenery')} className={`${tabBaseClass} ${activeTab === 'scenery' ? tabActiveClass : tabInactiveClass}`}>Kỳ Quan</button>}
            </div>

            <div className="mt-4">
                {activeTab === 'main' && <MainHallPanel sect={currentSect} rank={currentRankInfo} rankIndex={currentRankIndex} onContribute={contributeToSect} gameState={gameState} />}
                {activeTab === 'missions' && <MissionPanel missions={gameState.sectMissions} onStartMission={startSectMission} onGenerate={prompt => generateAiContent('mission', prompt)} generationCost={25 * (1 + gameState.realmLevel * 0.5)} currentBalance={gameState.spiritStones} />}
                {activeTab === 'treasury' && <SectTreasuryPanel sect={currentSect} rankIndex={currentRankIndex} contribution={gameState.sectContribution} stock={gameState.sectTreasuryStock} onBuy={buySectItem} />}
                {activeTab === 'scenery' && canAccessScenery && <SectSceneryPanel sectSceneryDescription={gameState.sectSceneryDescription} onGenerate={generateSectScenery} cost={300} currentStones={gameState.spiritStones} />}
            </div>
        </div>
    );
};

// --- Sub-components ---

const MainHallPanel: React.FC<{ sect: Sect; rank?: SectRank; rankIndex: number; onContribute: (amount: number) => void; gameState: any; }> = ({ sect, rank, rankIndex, onContribute, gameState }) => {
    const [contributionAmount, setContributionAmount] = useState('100');
    const nextRank = sect.ranks[rankIndex + 1];

    const contributionProgress = nextRank 
        ? Math.min(100, (gameState.sectContribution / nextRank.contributionRequired) * 100)
        : 100;
    
    const currentContribution = Math.floor(gameState.sectContribution);
    const requiredContribution = nextRank ? nextRank.contributionRequired : currentContribution;

    return (
        <div className="space-y-6">
            {/* Rank Progression Section */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 space-y-4">
                <h4 className="text-xl font-bold text-center text-cyan-300 text-shadow mb-4">Lộ Trình Chức Vụ</h4>
                
                <div className="grid grid-cols-3 items-center gap-4 text-center">
                    {/* Current Rank */}
                    <div className="p-3 bg-black/30 rounded-lg">
                        <p className="text-sm text-yellow-300">Hiện tại</p>
                        <p className="text-lg font-bold truncate">{rank?.name || 'N/A'}</p>
                        <p className="text-sm text-green-400 font-semibold">+{formatNumber(rank?.qiBonus || 0)} Linh Khí/giây</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-cyan-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>

                    {/* Next Rank */}
                    <div className="p-3 bg-black/30 rounded-lg">
                        <p className="text-sm text-yellow-300">Tiếp theo</p>
                        {nextRank ? (
                            <>
                                <p className="text-lg font-bold truncate">{nextRank.name}</p>
                                <p className="text-sm text-green-400 font-semibold">+{formatNumber(nextRank.qiBonus)} Linh Khí/giây</p>
                            </>
                        ) : (
                            <p className="text-lg font-bold">Tối đa</p>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {nextRank && (
                    <div className="pt-4 space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-cyan-800 relative overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-500"
                                style={{ width: `${contributionProgress}%` }}
                            >
                               {contributionProgress.toFixed(1)}%
                            </div>
                        </div>
                        <p className="text-center text-lg font-mono text-gray-200 mt-1">
                            {formatNumber(currentContribution)} / {formatNumber(requiredContribution)} Cống Hiến
                        </p>
                    </div>
                )}
            </div>

            <ContributionPanel 
                spiritStones={gameState.spiritStones}
                amount={contributionAmount}
                setAmount={setContributionAmount}
                onContribute={onContribute}
            />
        </div>
    );
};


interface JoinSectViewProps {
    sects: Sect[];
    onJoin: (sectId: string) => void;
    onGenerate: (prompt: string) => Promise<void>;
    generationCost: number;
    currentBalance: number;
}
const JoinSectView: React.FC<JoinSectViewProps> = ({ sects, onJoin, onGenerate, generationCost, currentBalance }) => (
     <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
        <div>
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Gia Nhập Tông Môn</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {sects.map(sect => (
                    <div key={sect.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-xl font-bold text-yellow-300">{sect.name}</h4>
                                <p className="text-sm text-gray-300 mt-1">{sect.description}</p>
                            </div>
                            <button
                                onClick={() => onJoin(sect.id)}
                                className="px-6 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white flex-shrink-0"
                            >
                                Gia Nhập
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <AiGenerator
            title="Sáng Lập Tông Môn"
            description="Mô tả một tông môn bạn muốn tồn tại, Thiên Cơ sẽ giúp bạn tạo ra nó."
            placeholder="Ví dụ: một tông môn của các nữ tu trên đảo tiên, một ma môn ẩn trong vực sâu..."
            onGenerate={onGenerate}
            cost={generationCost}
            currentBalance={currentBalance}
            currencyName="Linh Thạch"
        />
    </div>
);

interface ContributionPanelProps {
    spiritStones: number;
    amount: string;
    setAmount: (value: string) => void;
    onContribute: (amount: number) => void;
}
const ContributionPanel: React.FC<ContributionPanelProps> = ({ spiritStones, amount, setAmount, onContribute }) => {
    const handleContribute = () => {
        const numAmount = parseInt(amount, 10);
        if (!isNaN(numAmount) && numAmount > 0) {
            onContribute(numAmount);
        }
    };
    const canAfford = spiritStones >= (parseInt(amount, 10) || 0);

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h4 className="text-xl font-bold text-yellow-300 mb-3">Cống Hiến Tông Môn (Linh Thạch)</h4>
            <div className="flex items-center gap-4">
                <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-grow p-2 rounded bg-gray-900 border border-gray-500 text-white w-full"
                    min="1"
                />
                <button
                    onClick={handleContribute}
                    disabled={!canAfford || (parseInt(amount, 10) || 0) <= 0}
                    className={`px-6 py-2 rounded-md font-semibold transition-colors ${canAfford && (parseInt(amount, 10) || 0) > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                    Cống Hiến
                </button>
            </div>
            {!canAfford && (parseInt(amount, 10) || 0) > 0 && <p className="text-red-400 text-sm mt-2">Không đủ Linh Thạch.</p>}
        </div>
    );
};

interface MissionPanelProps {
    missions: any[];
    onStartMission: (missionId: string) => void;
    onGenerate: (prompt: string) => Promise<void>;
    generationCost: number;
    currentBalance: number;
}
const MissionPanel: React.FC<MissionPanelProps> = ({ missions, onStartMission, onGenerate, generationCost, currentBalance }) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleStartMission = (missionId: string) => {
        setIsLoading(missionId);
        try {
            onStartMission(missionId);
        } finally {
            setTimeout(() => setIsLoading(null), 300);
        }
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 space-y-4">
            <h4 className="text-xl font-bold text-yellow-300">Nhiệm Vụ Tông Môn</h4>
            <div className='space-y-4'>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {missions.map(m => (
                        <div key={m.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                            <div>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-sm text-gray-400">Thời gian: {m.duration} phút | Thưởng: {m.reward.contribution} cống hiến</p>
                            </div>
                            <button
                                onClick={() => handleStartMission(m.id)}
                                disabled={!!isLoading}
                                className="px-4 py-1 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white w-24 text-center disabled:bg-gray-600 disabled:cursor-wait"
                            >
                                {isLoading === m.id ? 'Đang...' : 'Thực Hiện'}
                            </button>
                        </div>
                    ))}
                </div>
                 <AiGenerator
                    title="Tạo Nhiệm Vụ"
                    description="Tạo ra một nhiệm vụ mới cho tông môn."
                    placeholder="Ví dụ: hộ tống trưởng lão, tìm kiếm một loại linh thảo hiếm..."
                    onGenerate={onGenerate}
                    cost={generationCost}
                    currentBalance={currentBalance}
                    currencyName="Linh Thạch"
                />
            </div>
        </div>
    );
};

interface SectTreasuryPanelProps {
    sect: Sect;
    rankIndex: number;
    contribution: number;
    stock: Record<string, boolean>;
    onBuy: (itemId: string) => void;
}

const SectTreasuryPanel: React.FC<SectTreasuryPanelProps> = ({ sect, rankIndex, contribution, stock, onBuy }) => {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 space-y-4">
            <h4 className="text-xl font-bold text-yellow-300 text-center">Trân Bảo Các</h4>
            <p className="text-center text-gray-400">Nơi đổi điểm cống hiến lấy các vật phẩm độc quyền của Tông Môn.</p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {sect.treasury.length === 0 && <p className="text-center text-gray-500 italic">Trân Bảo Các hiện không có vật phẩm nào.</p>}
                {sect.treasury.map(item => {
                    const isBought = stock[item.id];
                    const canAfford = contribution >= item.cost;
                    const meetsRank = rankIndex >= item.rankRequired;
                    const rankName = sect.ranks[item.rankRequired]?.name || 'Yêu cầu không xác định';

                    let buttonText = 'Đổi';
                    let disabled = false;
                    if (isBought) { buttonText = 'Đã Mua'; disabled = true; }
                    else if (!meetsRank) { buttonText = 'Chức Vị Thấp'; disabled = true; }
                    else if (!canAfford) { buttonText = 'Không Đủ Cống Hiến'; disabled = true; }
                    
                    return (
                        <div key={item.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                            <div>
                                <p className="font-bold text-lg text-yellow-200">{item.name}</p>
                                <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                                <p className="text-sm text-cyan-400 mt-1">Yêu cầu: {formatNumber(item.cost)} Cống hiến & Chức vị [{rankName}]</p>
                            </div>
                            <button
                                onClick={() => onBuy(item.id)}
                                disabled={disabled}
                                className="px-4 py-2 rounded-md font-semibold transition-colors text-white w-48 text-center bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {buttonText}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


interface SectSceneryPanelProps {
    sectSceneryDescription: string | null;
    onGenerate: () => Promise<void>;
    cost: number;
    currentStones: number;
}

const SectSceneryPanel: React.FC<SectSceneryPanelProps> = ({ sectSceneryDescription, onGenerate, cost, currentStones }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            await onGenerate();
        } catch (e) {
            // Error is handled in the hook's log
        } finally {
            setIsLoading(false);
        }
    };
    
    const canAfford = currentStones >= cost;

    const formattedDescription = sectSceneryDescription
        ? sectSceneryDescription.replace(/\*\*(.*?)\*\*/g, '<strong class="text-xl text-yellow-300 block mb-2">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>')
        : '';

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-700">
            <h4 className="text-xl font-bold text-yellow-300 mb-3 text-center">Cảnh Quan Tông Môn</h4>
            {sectSceneryDescription ? (
                <blockquote className="p-4 bg-black/20 rounded-md text-center" dangerouslySetInnerHTML={{ __html: formattedDescription }} />
            ) : (
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Tông môn chưa có kỳ quan đặc biệt nào. Với địa vị của mình, bạn có thể kiến tạo một cảnh quan để tăng thêm uy danh cho tông môn.</p>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !canAfford}
                        className="px-6 py-2 rounded-md font-semibold transition-colors bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang Kiến Tạo...' : 'Kiến Tạo Cảnh Quan'}
                    </button>
                    <p className={`text-sm mt-2 ${canAfford ? 'text-gray-300' : 'text-red-400'}`}>
                        Chi phí: {formatNumber(cost)} Linh Thạch
                    </p>
                </div>
            )}
        </div>
    );
};

export default SectView;