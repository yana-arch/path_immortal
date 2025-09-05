import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { ApiKey, ApiKeyGroup } from '../types';

// Helper function to mask API keys for display
const maskApiKey = (key: string) => {
    if (key.length < 8) return '***';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

// --- Sub-component for API Key Management ---
const ApiKeyManager: React.FC = () => {
    const { gameState, addApiKey, deleteApiKey, createApiKeyGroup, updateApiKeyGroup, deleteApiKeyGroup, setActiveApiKeyGroup } = useGameContext();
    const { apiSettings } = gameState;

    const [newKeyAlias, setNewKeyAlias] = useState('');
    const [newKeyValue, setNewKeyValue] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [editingGroup, setEditingGroup] = useState<ApiKeyGroup | null>(null);
    const [selectedKeyIds, setSelectedKeyIds] = useState<string[]>([]);

    const handleAddKey = () => {
        if (newKeyAlias.trim() && newKeyValue.trim()) {
            addApiKey(newKeyAlias.trim(), newKeyValue.trim());
            setNewKeyAlias('');
            setNewKeyValue('');
        }
    };
    
    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            createApiKeyGroup(newGroupName.trim());
            setNewGroupName('');
        }
    };

    const handleOpenEditModal = (group: ApiKeyGroup) => {
        setEditingGroup(group);
        setSelectedKeyIds(group.keyIds);
    };

    const handleCloseEditModal = () => {
        setEditingGroup(null);
        setSelectedKeyIds([]);
    };

    const handleSaveGroupChanges = () => {
        if (editingGroup) {
            updateApiKeyGroup(editingGroup.id, editingGroup.name, selectedKeyIds);
            handleCloseEditModal();
        }
    };

    const handleKeySelectionChange = (keyId: string) => {
        setSelectedKeyIds(prev =>
            prev.includes(keyId) ? prev.filter(id => id !== keyId) : [...prev, keyId]
        );
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 space-y-6">
            <h4 className="text-xl font-bold text-yellow-300">Quản Lý Thiên Mệnh Phù (API Key)</h4>
            
            <div className="p-3 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200 text-sm">
                <p><strong>Cảnh Báo An Toàn:</strong> API Key được lưu trữ trong trình duyệt của bạn (localStorage) và có thể không an toàn. Chỉ sử dụng các key dành cho mục đích thử nghiệm hoặc phát triển. Không sử dụng key sản xuất quan trọng.</p>
            </div>

            {/* API Key List and Form */}
            <div className="space-y-3">
                <h5 className="text-lg font-semibold text-cyan-300">Danh Sách Thiên Mệnh Phù</h5>
                <div className="space-y-2 p-3 bg-black/20 rounded-md max-h-48 overflow-y-auto">
                    {Object.keys(apiSettings.keys).length === 0 && <p className="text-gray-400">Chưa có Thiên Mệnh Phù nào.</p>}
                    {/* Fix: Added explicit type 'ApiKey' to fix typing errors. */}
                    {Object.values(apiSettings.keys).map((key: ApiKey) => (
                        <div key={key.id} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                            <div>
                                <p className="font-semibold">{key.alias}</p>
                                <p className="text-sm text-gray-400 font-mono">{maskApiKey(key.key)}</p>
                            </div>
                            <button onClick={() => deleteApiKey(key.id)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 items-end">
                    <input value={newKeyAlias} onChange={e => setNewKeyAlias(e.target.value)} placeholder="Biệt danh" className="flex-1 p-2 rounded bg-gray-900 border border-gray-500 text-white"/>
                    <input value={newKeyValue} onChange={e => setNewKeyValue(e.target.value)} placeholder="API Key" className="flex-1 p-2 rounded bg-gray-900 border border-gray-500 text-white"/>
                    <button onClick={handleAddKey} className="px-4 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white">Thêm</button>
                </div>
            </div>

            {/* API Key Groups */}
            <div className="space-y-3">
                <h5 className="text-lg font-semibold text-cyan-300">Phù Trận (Nhóm Key)</h5>
                <div className="space-y-2">
                    {Object.keys(apiSettings.groups).length === 0 && <p className="text-gray-400">Chưa có Phù Trận nào.</p>}
                    {/* Fix: Added explicit type 'ApiKeyGroup' to fix typing errors. */}
                    {Object.values(apiSettings.groups).map((group: ApiKeyGroup) => (
                        <div key={group.id} className={`p-3 rounded-lg border ${apiSettings.activeGroupId === group.id ? 'bg-cyan-900/40 border-cyan-500' : 'bg-gray-700/50 border-gray-600'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="activeGroup" 
                                        id={`group_${group.id}`}
                                        checked={apiSettings.activeGroupId === group.id}
                                        onChange={() => setActiveApiKeyGroup(group.id)}
                                        className="form-radio h-5 w-5 bg-gray-900 text-cyan-500 focus:ring-cyan-600"
                                        aria-label={`Kích hoạt nhóm ${group.name}`}
                                    />
                                    <label htmlFor={`group_${group.id}`} className="text-lg font-bold">{group.name}</label>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenEditModal(group)} className="px-3 py-1 rounded-md text-sm font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white">Chỉnh Sửa</button>
                                    <button onClick={() => deleteApiKeyGroup(group.id)} className="px-3 py-1 rounded-md text-sm font-semibold transition-colors bg-red-600 hover:bg-red-500 text-white">Xóa</button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2 pl-8">
                                {group.keyIds.map(keyId => apiSettings.keys[keyId]?.alias).map(alias => 
                                    alias && <span key={alias} className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded-full">{alias}</span>
                                )}
                                {group.keyIds.length === 0 && <span className="text-xs text-gray-400 italic">Trống</span>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 items-end">
                    <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Tên Phù Trận mới" className="flex-1 p-2 rounded bg-gray-900 border border-gray-500 text-white"/>
                    <button onClick={handleCreateGroup} className="px-4 py-2 rounded-md font-semibold transition-colors bg-green-600 hover:bg-green-500 text-white">Tạo</button>
                </div>
            </div>

            {/* Edit Group Modal */}
            {editingGroup && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 max-w-md w-full item-shadow text-white mx-4 space-y-4">
                        <h3 className="text-2xl font-bold text-yellow-300">Chỉnh Sửa Phù Trận: {editingGroup.name}</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/20 rounded">
                            {/* Fix: Added explicit type 'ApiKey' to fix typing errors. */}
                            {Object.values(apiSettings.keys).map((key: ApiKey) => (
                                <label key={key.id} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded cursor-pointer hover:bg-gray-700">
                                    <input 
                                        type="checkbox"
                                        checked={selectedKeyIds.includes(key.id)}
                                        onChange={() => handleKeySelectionChange(key.id)}
                                        className="form-checkbox h-5 w-5 bg-gray-900 rounded text-cyan-500 focus:ring-cyan-600"
                                    />
                                    <span>{key.alias}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleCloseEditModal} className="px-4 py-2 rounded-md font-semibold transition-colors bg-gray-600 hover:bg-gray-500 text-white">Hủy</button>
                            <button onClick={handleSaveGroupChanges} className="px-4 py-2 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white">Lưu</button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};


const SettingsView: React.FC = () => {
    const { saveGame, resetGame, toggleEventGeneration, gameState, toggleNsfwMode } = useGameContext();
    const { isEventGenerationEnabled, gameSettings } = gameState;

    return (
        <div className="w-full p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm text-white h-auto space-y-6">
            <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow mb-4 pb-2 border-b border-cyan-800/50">Cài Đặt</h3>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 space-y-4">
                <h4 className="text-xl font-bold text-yellow-300">Cài Đặt Trò Chơi</h4>
                 {/* Event Toggle Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="text-lg font-semibold text-white">Sự Kiện Ngẫu Nhiên</h5>
                        <p className="text-sm text-gray-300 mt-1">Bật/tắt các sự kiện bất ngờ.</p>
                    </div>
                    <label htmlFor="event-toggle-settings" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="event-toggle-settings" className="sr-only peer" checked={isEventGenerationEnabled} onChange={toggleEventGeneration} />
                        <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>
                 {/* NSFW Toggle Section */}
                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                    <div>
                        <h5 className="text-lg font-semibold text-white">Chế Độ Thân Mật (NSFW)</h5>
                        <p className="text-sm text-gray-300 mt-1">Bật để có các hội thoại riêng tư táo bạo hơn với Đạo Lữ.</p>
                        <p className="text-xs text-rose-400 mt-1">Lưu ý: Nội dung vẫn tuân thủ chính sách an toàn của AI.</p>
                    </div>
                    <label htmlFor="nsfw-toggle-settings" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="nsfw-toggle-settings" className="sr-only peer" checked={gameSettings.isNsfwEnabled} onChange={toggleNsfwMode} />
                        <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-rose-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                </div>
            </div>

            {/* Save/Reset Section */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h4 className="text-xl font-bold text-yellow-300 mb-3">Quản Lý Dữ Liệu</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={saveGame}
                        className="flex-1 px-6 py-3 rounded-md font-semibold transition-colors bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Lưu Tiến Trình
                    </button>
                    <button
                        onClick={resetGame}
                        className="flex-1 px-6 py-3 rounded-md font-semibold transition-colors bg-red-700 hover:bg-red-600 text-white"
                    >
                        Bắt Đầu Lại
                    </button>
                </div>
            </div>
            
            <ApiKeyManager />

        </div>
    );
};

export default SettingsView;
