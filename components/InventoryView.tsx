import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { InventoryItem } from '../types';

const InventoryView: React.FC = () => {
    const { gameState, useItem, discardItem } = useGameContext();
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    // This effect ensures that if the selected item stack is removed from the game state,
    // the local selection is also cleared.
    useEffect(() => {
        if (selectedItem && !gameState.inventory.find(i => i.id === selectedItem.id)) {
            setSelectedItem(null);
        }
    }, [gameState.inventory, selectedItem]);


    const handleItemClick = (item: InventoryItem) => {
        setSelectedItem(item);
    };

    const handleUseItem = () => {
        if (selectedItem) {
            useItem(selectedItem.id);
            // The useEffect above will handle clearing the selection if the stack is depleted.
            // If not, update the local quantity for immediate UI feedback.
            if (selectedItem.quantity > 1) {
                setSelectedItem(prev => prev ? {...prev, quantity: prev.quantity - 1} : null);
            }
        }
    };

    const handleDiscardItem = () => {
        if (selectedItem) {
            const amountStr = prompt(`Bạn muốn vứt bỏ bao nhiêu ${selectedItem.name}? (Để trống để vứt bỏ tất cả)`, selectedItem.quantity.toString());
            if (amountStr === null) return; // User cancelled
            
            const quantity = amountStr === '' ? selectedItem.quantity : parseInt(amountStr, 10);
            
            if (!isNaN(quantity) && quantity > 0) {
                const quantityToDiscard = Math.min(quantity, selectedItem.quantity);
                discardItem(selectedItem.id, quantityToDiscard);
                
                if (selectedItem.quantity <= quantityToDiscard) {
                    setSelectedItem(null);
                } else {
                     setSelectedItem(prev => prev ? {...prev, quantity: prev.quantity - quantityToDiscard} : null);
                }
            }
        }
    };

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-6 pb-2 border-b border-cyan-800/50">Túi Trữ Vật</h3>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Item Grid */}
                <div className="lg:w-2/3 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 h-96 overflow-y-auto">
                    {gameState.inventory.length === 0 && (
                        <p className="col-span-full text-center text-gray-400 self-center">Túi trữ vật của bạn trống rỗng.</p>
                    )}
                    {gameState.inventory.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-200
                                ${selectedItem?.id === item.id ? 'bg-cyan-700/80 border-2 border-cyan-300' : 'bg-gray-800/70 border-2 border-gray-600 hover:border-cyan-500'}`}
                            title={`${item.name} (x${item.quantity})`}
                        >
                            {/* Placeholder for icon */}
                            <div className="text-3xl">📜</div>
                            <span className="text-xs text-center truncate w-full mt-1">{item.name}</span>
                            <span className="absolute bottom-1 right-1 text-sm font-bold bg-black/50 px-1.5 py-0.5 rounded">{item.quantity}</span>
                        </div>
                    ))}
                </div>

                {/* Item Details */}
                <div className="lg:w-1/3 p-4 bg-gray-800/50 rounded-lg border border-gray-600 flex flex-col h-96">
                    {selectedItem ? (
                        <>
                            <h4 className="text-xl font-bold text-yellow-300 mb-2">{selectedItem.name}</h4>
                            <p className="text-sm text-gray-300 mb-4 flex-grow overflow-y-auto pr-2">{selectedItem.description}</p>
                            <div className="space-y-3 mt-auto">
                                {selectedItem.type === 'elixir' && (
                                     <button
                                        onClick={handleUseItem}
                                        className="w-full px-4 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white"
                                    >
                                        Sử Dụng
                                    </button>
                                )}
                                <button
                                    onClick={handleDiscardItem}
                                    className="w-full px-4 py-2 rounded-md font-semibold transition-colors bg-red-700 hover:bg-red-600 text-white"
                                >
                                    Vứt Bỏ
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">Chọn một vật phẩm để xem chi tiết.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryView;
