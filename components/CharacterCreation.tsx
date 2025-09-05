import React, { useState } from 'react';
import { APPEARANCES } from '../constants';

interface CharacterCreationProps {
  onCharacterCreate: (gender: 'Nam' | 'Nữ', appearance: string) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [appearance, setAppearance] = useState(APPEARANCES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCharacterCreate(gender, appearance);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-cover bg-center bg-fixed flex items-center justify-center z-50" style={{backgroundImage: "url('/background.jpg')"}}>
      <div className="bg-black/70 border border-cyan-500 rounded-lg p-8 max-w-lg w-full item-shadow text-white mx-4 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-center text-cyan-300 text-shadow-lg mb-6">Sáng Tạo Nhân Vật</h1>
        <p className="text-center text-gray-300 mb-8">Hãy bắt đầu con đường tu tiên của bạn bằng cách chọn giới tính và dung mạo.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender Selection */}
          <div>
            <label className="block text-xl font-semibold text-yellow-300 mb-3">Giới Tính</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGender('Nam')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all border-2 ${gender === 'Nam' ? 'bg-blue-600/50 border-cyan-400' : 'bg-gray-700/50 border-gray-600 hover:border-cyan-500'}`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('Nữ')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all border-2 ${gender === 'Nữ' ? 'bg-pink-600/50 border-rose-400' : 'bg-gray-700/50 border-gray-600 hover:border-rose-500'}`}
              >
                Nữ
              </button>
            </div>
          </div>

          {/* Appearance Selection */}
          <div>
            <label htmlFor="appearance-select" className="block text-xl font-semibold text-yellow-300 mb-3">Dung Mạo</label>
            <select
              id="appearance-select"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-500 text-white text-lg"
            >
              {APPEARANCES.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-xl transition-colors animate-pulse-slow"
            >
              Bắt Đầu Tu Luyện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;
