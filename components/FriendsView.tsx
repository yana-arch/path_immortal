

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Friend } from '../types';
import { DAO_LU_RELATIONSHIP_REQUIREMENT } from '../constants';

const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Sẵn sàng";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const FriendCard: React.FC<{ friend: Friend }> = ({ friend }) => {
    const { gameState, sendGiftToFriend, startDialogueWithFriend, formPartnership, startSongTu, startDaoLuChat } = useGameContext();
    const [giftAmount, setGiftAmount] = useState('10');
    const [isDialogueLoading, setIsDialogueLoading] = useState(false);
    const [isDaoLuChatLoading, setIsDaoLuChatLoading] = useState(false);
    const [songTuCooldown, setSongTuCooldown] = useState(0);

    const isDaoLu = gameState.daoLuIds.includes(friend.id);
    const canBecomeDaoLu = !isDaoLu && friend.relationshipLevel >= DAO_LU_RELATIONSHIP_REQUIREMENT;

    useEffect(() => {
        if (!isDaoLu) {
            setSongTuCooldown(0);
            return;
        }

        const interval = setInterval(() => {
            const cooldownEnd = gameState.songTuCooldowns[friend.id] || 0;
            const remaining = (cooldownEnd - Date.now()) / 1000;
            setSongTuCooldown(Math.max(0, remaining));
        }, 1000);

        return () => clearInterval(interval);

    }, [gameState.songTuCooldowns, friend.id, isDaoLu]);

    const handleSendGift = () => {
        const amount = parseInt(giftAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            sendGiftToFriend(friend.id, amount);
        }
    };

    const handleDialogue = async () => {
        if (isDialogueLoading) return;
        setIsDialogueLoading(true);
        try {
            await startDialogueWithFriend(friend.id);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDialogueLoading(false);
        }
    };
    
    const handleDaoLuChat = async () => {
        if (isDaoLuChatLoading) return;
        setIsDaoLuChatLoading(true);
        try {
            await startDaoLuChat(friend.id);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDaoLuChatLoading(false);
        }
    };

    const numGiftAmount = parseInt(giftAmount, 10) || 0;
    const canAfford = gameState.spiritStones >= numGiftAmount;
    const isSongTuOnCooldown = songTuCooldown > 0;

    return (
        <div className={`p-4 bg-gray-800/50 rounded-lg border ${isDaoLu ? 'border-rose-400' : 'border-gray-600'} space-y-3 transition-all`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-xl font-bold text-yellow-300">{friend.name}</h4>
                    <p className="text-sm text-cyan-400 mt-1">Cảnh giới: {friend.realm}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-green-400">Thân Thiết</p>
                    <p className="text-xl font-bold">{friend.relationshipLevel.toFixed(2)}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 border-t border-gray-700 pt-3">{friend.background}</p>
            
            <div className="border-t border-gray-700 pt-3 space-y-3">
                <div className="flex items-end gap-2 flex-wrap">
                    <div className="flex-grow min-w-[200px]">
                        <p className="text-sm text-gray-200 mb-1">Tặng quà (Linh Thạch):</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={giftAmount}
                                onChange={(e) => setGiftAmount(e.target.value)}
                                className="flex-grow p-2 rounded bg-gray-900 border border-gray-500 text-white w-full h-10"
                                min="1"
                            />
                            <button
                                onClick={handleSendGift}
                                disabled={!canAfford || numGiftAmount <= 0}
                                className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm h-10 ${canAfford && numGiftAmount > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                            >
                                Tặng
                            </button>
                        </div>
                        {!canAfford && numGiftAmount > 0 && <p className="text-red-400 text-xs mt-1">Không đủ Linh Thạch.</p>}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                         <button
                            onClick={handleDialogue}
                            disabled={isDialogueLoading}
                            className="px-4 py-2 h-10 rounded-md font-semibold transition-colors text-sm bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:cursor-wait"
                        >
                            {isDialogueLoading ? '...' : 'Hội Thoại'}
                        </button>
                        {canBecomeDaoLu && (
                             <button
                                onClick={() => formPartnership(friend.id)}
                                className="px-4 py-2 h-10 rounded-md font-semibold transition-colors text-sm bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                            >
                                Kết thành Đạo Lữ
                            </button>
                        )}
                    </div>
                </div>
                 {isDaoLu && (
                    <div className="mt-2 pt-3 border-t border-rose-800/50 space-y-2">
                        <h5 className="text-lg font-bold text-rose-300 text-center">Tương Tác Đạo Lữ</h5>
                        <div className="flex gap-2 justify-center flex-wrap">
                            <button
                                onClick={() => startSongTu(friend.id)}
                                disabled={isSongTuOnCooldown}
                                className="flex-1 px-4 py-2 rounded-md font-semibold transition-colors text-base bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Song Tu {isSongTuOnCooldown ? `(${formatTime(songTuCooldown)})` : ''}
                            </button>
                            <button
                                onClick={handleDaoLuChat}
                                disabled={isDaoLuChatLoading}
                                className="flex-1 px-4 py-2 rounded-md font-semibold transition-colors text-base bg-pink-600 hover:bg-pink-500 text-white disabled:bg-gray-700 disabled:cursor-wait"
                            >
                               {isDaoLuChatLoading ? '...' : 'Trò Chuyện Riêng'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const FriendsView: React.FC = () => {
    const { gameState } = useGameContext();
    const { friends } = gameState;

    const totalRelationship = friends.reduce((sum, f) => sum + f.relationshipLevel, 0);
    const friendBonus = totalRelationship * 0.1; // 0.1% per level

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-4 pb-2 border-b border-cyan-800/50">Danh Sách Đạo Hữu</h3>
            
            <div className="p-3 bg-gray-800/60 rounded-lg text-center border border-cyan-700">
                <h4 className="text-lg font-semibold text-yellow-300">Đạo Hữu Trợ Lực</h4>
                <p className="text-cyan-200">Tổng độ thân thiết của bạn bè giúp tăng tốc độ tu luyện thêm <span className="font-bold text-xl">{friendBonus.toFixed(2)}%</span>.</p>
            </div>

            {friends.length === 0 ? (
                <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400">Bạn chưa có đạo hữu nào.</p>
                    <p className="text-sm text-gray-500 mt-2">Hãy du lịch, làm nhiệm vụ hoặc khám phá thế giới để tìm kiếm tri kỷ trên con đường tu tiên!</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {friends.sort((a,b) => b.relationshipLevel - a.relationshipLevel).map(friend => (
                       <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsView;