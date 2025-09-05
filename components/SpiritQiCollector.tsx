import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { SPIRIT_VEIN_MAX_CHARGE, formatQi } from '../constants';

const SpiritQiCollector: React.FC = () => {
  const { gameState, collectSpiritVein, qiPerSecond } = useGameContext();
  const [isAnimating, setIsAnimating] = useState(false);

  const chargePercentage = Math.min(100, ((gameState.spiritVeinCharge || 0) / SPIRIT_VEIN_MAX_CHARGE) * 100);
  const isFullyCharged = chargePercentage >= 100;

  const handleClick = () => {
    if ((gameState.spiritVeinCharge || 0) < 1) return;

    collectSpiritVein();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Duration should match CSS animation
  };

  const potentialGain = (gameState.spiritVeinCharge || 0) * qiPerSecond * 0.1;

  return (
    <div className="p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-center flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-2 pb-2 border-b border-cyan-800/50 w-full">Tụ Linh Trận</h3>
        <p className="text-gray-400 mb-4 max-w-md">Linh trận tự động tích tụ linh khí. Thu hoạch khi đã đầy để nhận hiệu ứng <span className="text-yellow-300 font-semibold">Bộc Phát</span>!</p>
        
        <div className="w-full max-w-sm my-4">
            <div className="relative h-4 bg-gray-700 rounded-full border border-cyan-800">
                <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${chargePercentage}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-shadow">{chargePercentage.toFixed(0)}%</span>
            </div>
             <p className="text-sm text-yellow-300 mt-2">
                Có thể thu hoạch: {formatQi(potentialGain)} Linh Khí
            </p>
        </div>


        <button
            onClick={handleClick}
            className={`w-52 h-52 bg-cyan-500/20 rounded-full border-4
                       hover:bg-cyan-500/40 hover:border-cyan-200 transition-all duration-300
                       flex items-center justify-center text-lg font-bold relative overflow-hidden
                       ${isAnimating ? 'qi-collect-animation' : ''}
                       ${isFullyCharged ? 'border-yellow-400 animate-pulse-slow shadow-lg shadow-yellow-400/20' : 'border-cyan-400'}`}
            aria-label="Thu thập Linh Khí"
            disabled={(gameState.spiritVeinCharge || 0) < 1}
        >
            <span className="z-10 text-cyan-100 drop-shadow-lg text-3xl">
                {isFullyCharged ? 'Bộc Phát!' : 'Thu Hoạch'}
            </span>
        </button>
    </div>
  );
};

export default SpiritQiCollector;