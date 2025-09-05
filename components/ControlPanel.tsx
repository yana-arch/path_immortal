import React from 'react';
import { ViewType } from '../types';

interface ControlPanelProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const viewsConfig: { group: string; items: { id: ViewType; name: string }[] }[] = [
    {
        group: 'Tu Luyện Căn Bản',
        items: [
            { id: 'cultivation', name: 'Công Pháp' },
            { id: 'treasures', name: 'Pháp Bảo' },
            { id: 'equipment', name: 'Trang Bị' },
            { id: 'alchemy', name: 'Luyện Đan' },
            { id: 'inventory', name: 'Túi Đồ' },
            { id: 'supernatural', name: 'Thần Thông' },
        ]
    },
    {
        group: 'Thế Giới Tương Tác',
        items: [
            { id: 'sect', name: 'Tông Môn' },
            { id: 'map', name: 'Du Lịch' },
            { id: 'friends', name: 'Bạn Bè' },
            { id: 'pavilion', name: 'Túy Tiên Lâu' },
        ]
    },
    {
        group: 'Tiến Trình & Sự Kiện',
        items: [
            { id: 'challenges', name: 'Thử Thách' },
            { id: 'event', name: 'Sự Kiện' },
            { id: 'history', name: 'Nhật Ký' },
        ]
    },
    {
        group: 'Hệ Thống',
        items: [
             { id: 'settings', name: 'Cài Đặt' },
        ]
    }
];

const ControlPanel: React.FC<ControlPanelProps> = ({ activeView, setActiveView }) => {
  const baseClass = "w-full text-left p-3 rounded-lg transition-colors duration-200 text-lg";
  const activeClass = "bg-cyan-600/50 text-white font-bold";
  const inactiveClass = "bg-black/40 hover:bg-cyan-800/50 text-cyan-200";

  return (
    <div className="p-4 bg-black/60 rounded-lg item-shadow backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-center text-cyan-300 text-shadow pb-2 border-b border-cyan-800/50">Bảng Điều Khiển</h3>
      <div className="flex flex-col gap-4">
        {viewsConfig.map(group => (
            <div key={group.group}>
                <h4 className="text-sm font-bold text-yellow-300/80 uppercase tracking-wider mb-2 px-1">{group.group}</h4>
                <div className="flex flex-col gap-2">
                    {group.items.map(view => (
                    <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`${baseClass} ${activeView === view.id ? activeClass : inactiveClass}`}
                    >
                        {view.name}
                    </button>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;