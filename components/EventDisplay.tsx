import React from 'react';
import { GameEvent } from '../types';

interface EventDisplayProps {
  event: GameEvent;
}

const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 max-w-lg w-full item-shadow text-white mx-4">
        <h2 className="text-2xl font-bold text-cyan-300 text-shadow mb-4">{event.title}</h2>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{event.description}</p>
        <div className="flex flex-col gap-3">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={choice.effect}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDisplay;
