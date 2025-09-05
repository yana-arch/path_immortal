import React, { useState } from 'react';
import { formatNumber } from '../constants';

interface AiGeneratorProps {
    title: string;
    description: string;
    placeholder: string;
    onGenerate: (prompt: string) => Promise<void>;
    cost: number;
    currentBalance: number;
    currencyName: 'Linh Khí' | 'Linh Thạch';
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ title, description, placeholder, onGenerate, cost, currentBalance, currencyName }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canAfford = currentBalance >= cost;

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading || !canAfford) return;
        
        setIsLoading(true);
        setError(null);
        try {
            await onGenerate(prompt);
            setPrompt(''); // Clear prompt on success
        } catch (e: any) {
            setError(e.message || 'Tạo thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-700 mt-6">
            <h4 className="text-xl font-bold text-yellow-300 mb-2">{title}</h4>
            <p className="text-sm text-gray-300 mb-4">{description}</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 rounded bg-gray-900 border border-gray-500 text-white h-20 resize-none focus:border-cyan-500 focus:ring-cyan-500 transition"
                disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-3">
                <p className={`text-sm font-semibold ${canAfford ? 'text-gray-300' : 'text-red-400'}`}>
                    Chi phí: {formatNumber(cost)} {currencyName}
                </p>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim() || !canAfford}
                    className="px-6 py-2 rounded-md font-semibold transition-colors bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang Diễn Toán...' : 'Bắt Đầu'}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
};

export default AiGenerator;