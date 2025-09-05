import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';

const EventView: React.FC = () => {
    const { generateCustomEvent, logs } = useGameContext();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateEvent = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            await generateCustomEvent(prompt);
            setPrompt(''); // Clear prompt on success
        } catch (e: any) {
            setError(e.message || 'Lỗi khi tạo sự kiện. Vui lòng thử lại.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-4 pb-2 border-b border-cyan-800/50">Thiên Cơ Lâu</h3>

            {/* Custom Event Generator */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h4 className="text-xl font-bold text-yellow-300 mb-3">Vấn Đạo Thiên Cơ</h4>
                <p className="text-sm text-gray-300 mb-4">Mô tả một hành động bạn muốn thực hiện, và xem Thiên Đạo sẽ mang lại cơ duyên hay kiếp nạn gì.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ví dụ: đi vào một hang động sâu thẳm, khiêu chiến một con yêu thú, hoặc ngồi lĩnh ngộ dưới gốc cây cổ thụ..."
                    className="w-full p-2 rounded bg-gray-900 border border-gray-500 text-white h-24 resize-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateEvent}
                    disabled={isLoading || !prompt.trim()}
                    className="mt-3 w-full px-6 py-2 rounded-md font-semibold transition-colors bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang Sáng Tạo...' : 'Tạo Sự Kiện'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>

            {/* Event Log Section */}
            <div>
                <h4 className="text-xl font-bold text-yellow-300 mb-4 text-center">Nhật Ký Gần Đây</h4>
                <div className="p-4 bg-gray-900/70 rounded-lg h-96 overflow-y-auto border border-gray-700 flex flex-col-reverse">
                    {/* Reversing the container and then rendering normally ensures it starts scrolled to the bottom (most recent) */}
                    <div>
                        {logs.length > 0 ? (
                            logs.slice().reverse().map((log, index) => (
                                <p key={index} className="text-sm text-gray-300 mb-2 border-b border-gray-800 pb-2">
                                    {log}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">Chưa có sự kiện nào xảy ra.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventView;