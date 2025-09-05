// Fix: Created DaoLuDialogueView.tsx component.

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';

const DaoLuDialogueView: React.FC = () => {
    const { gameState, closeDaoLuChat, sendDaoLuMessage } = useGameContext();
    const { activeDaoLuChat } = gameState;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [activeDaoLuChat?.messages]);

    if (!activeDaoLuChat) {
        return null;
    }

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        setIsSending(true);
        try {
            await sendDaoLuMessage(activeDaoLuChat.friendId, message.trim());
            setMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally, show an error to the user
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-rose-500 rounded-lg p-4 max-w-lg w-full item-shadow text-white mx-4 flex flex-col h-[80vh]">
                <div className="flex justify-between items-center border-b border-rose-800/50 pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-rose-300 text-shadow">Trò chuyện với {activeDaoLuChat.friendName}</h2>
                    <button onClick={closeDaoLuChat} className="text-gray-400 hover:text-white font-bold text-2xl">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {activeDaoLuChat.messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'friend' && <div className="w-8 h-8 rounded-full bg-pink-500 flex-shrink-0"></div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="mt-4 pt-4 border-t border-rose-800/50 flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nói gì đó..."
                        className="flex-grow p-2 rounded bg-gray-900 border border-gray-500 text-white"
                        disabled={isSending}
                    />
                    <button onClick={handleSend} disabled={isSending || !message.trim()} className="px-6 py-2 rounded-md font-semibold transition-colors bg-pink-600 hover:bg-pink-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isSending ? '...' : 'Gửi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DaoLuDialogueView;
