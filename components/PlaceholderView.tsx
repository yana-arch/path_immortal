
import React from 'react';

interface PlaceholderViewProps {
  featureName: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ featureName }) => {
  return (
    <div className="w-full lg:w-1/3 p-4 bg-black/60 rounded-lg item-shadow text-white flex flex-col items-center justify-center h-96 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-center text-cyan-300 text-shadow">{featureName}</h3>
      <p className="mt-4 text-gray-400">Tính năng này sẽ được phát triển trong tương lai.</p>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mt-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
};
