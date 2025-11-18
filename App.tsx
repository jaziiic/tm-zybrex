
import React, { useState } from 'react';
import SingleSpeaker from './components/SingleSpeaker';
import MultiSpeaker from './components/MultiSpeaker';
import { SpeakerIcon } from './components/icons/SpeakerIcon';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SINGLE);

  const getButtonClass = (mode: ViewMode) => {
    const baseClass = 'w-full py-3 px-4 text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900';
    if (viewMode === mode) {
      return `${baseClass} bg-green-600 text-white shadow-md`;
    }
    return `${baseClass} bg-slate-700 text-gray-300 hover:bg-slate-600`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
            <SpeakerIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Zybrex
            </h1>
          </div>
          <p className="mt-2 text-gray-400">Your AI-Powered Text to Voice Companion</p>
        </header>

        <main>
          <div className="bg-slate-800 rounded-lg p-2 mb-8 flex overflow-hidden">
            <button
              onClick={() => setViewMode(ViewMode.SINGLE)}
              className={`${getButtonClass(ViewMode.SINGLE)} rounded-l-md`}
            >
              Single Speaker
            </button>
            <button
              onClick={() => setViewMode(ViewMode.MULTI)}
              className={`${getButtonClass(ViewMode.MULTI)} rounded-r-md`}
            >
              Multi Speaker
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
            {viewMode === ViewMode.SINGLE ? <SingleSpeaker /> : <MultiSpeaker />}
          </div>
        </main>

        <footer className="text-center mt-8 text-xs text-gray-500">
          <p>Powered by Gemini API. Designed for a professional audio experience.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
