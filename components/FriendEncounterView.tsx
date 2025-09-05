import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { PendingFriend } from '../types';

const FriendEncounterView: React.FC = () => {
  const { gameState, confirmNewFriend, cancelNewFriend } = useGameContext();
  const { pendingFriend } = gameState;

  const [friendData, setFriendData] = useState<PendingFriend | null>(null);

  useEffect(() => {
    if (pendingFriend) {
      setFriendData(pendingFriend);
    }
  }, [pendingFriend]);

  if (!pendingFriend || !friendData) {
    return null;
  }

  const handleConfirm = () => {
    if (friendData.name.trim()) {
      confirmNewFriend(friendData);
    }
  };
  
  const handleCancel = () => {
    cancelNewFriend();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFriendData({
        ...friendData,
        [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 max-w-lg w-full item-shadow text-white mx-4 space-y-4">
        <h2 className="text-2xl font-bold text-yellow-300 text-shadow text-center">Gặp Gỡ Kỳ Duyên</h2>
        <p className="text-center text-gray-300">Bạn đã gặp một tu sĩ có vẻ phi phàm. Bạn có muốn kết giao bằng hữu?</p>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="friendName" className="block text-sm font-medium text-gray-300 mb-1">Danh xưng:</label>
                <input 
                    type="text"
                    id="friendName"
                    name="name"
                    value={friendData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-900 border border-gray-500 text-white"
                />
            </div>
            <div>
                <label htmlFor="friendBackground" className="block text-sm font-medium text-gray-300 mb-1">Tiểu sử:</label>
                <textarea
                    id="friendBackground"
                    name="background"
                    value={friendData.background}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-900 border border-gray-500 text-white h-24 resize-none"
                />
            </div>
             <p className="text-sm text-gray-400">Cảnh giới: {friendData.realm}</p>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-md font-semibold transition-colors bg-gray-600 hover:bg-gray-500 text-white"
          >
            Từ Chối
          </button>
          <button
            onClick={handleConfirm}
            disabled={!friendData.name.trim()}
            className="px-6 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Kết Giao
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendEncounterView;