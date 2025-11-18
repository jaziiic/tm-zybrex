import React, { useState, useCallback } from 'react';
import { generateSingleSpeakerSpeech } from '../services/geminiService';
import { pcmToWavBlob, decode, decodeAudioData } from '../utils/audioUtils';
import Spinner from './shared/Spinner';
import { PlayIcon } from './icons/PlayIcon';

const voiceOptions = [
    { id: 'puck', name: 'Baby Boy 1 (Playful)', voiceName: 'Puck' },
    { id: 'charon', name: 'Baby Boy 2 (Calm)', voiceName: 'Charon' },
    { id: 'zephyr', name: 'Baby Girl 1 (Bright)', voiceName: 'Zephyr' },
];

const SingleSpeaker: React.FC = () => {
    const [text, setText] = useState<string>('Hello! I am a baby. I like to play with my toys all day long.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<string>(voiceOptions[0].voiceName);

    const handleGenerateSpeech = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter some text to generate speech.');
            return;
        }

        setIsLoading(true);
        setError(null);
        if(audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);

        try {
            const base64Audio = await generateSingleSpeakerSpeech(text, selectedVoice);
            
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
            
            const pcmData = audioBuffer.getChannelData(0);
            const wavBlob = pcmToWavBlob(pcmData, 24000);
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);

        } catch (err) {
            console.error('Error generating speech:', err);
            setError('Failed to generate speech. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    }, [text, audioUrl, selectedVoice]);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Single Speaker Mode</h2>
            <p className="mb-4 text-gray-400">Choose a voice, enter any text below, and hear it spoken.</p>
            
            <div className="mb-5">
                <fieldset>
                    <legend className="text-lg font-medium text-gray-300 mb-3">Choose a Voice:</legend>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3">
                        {voiceOptions.map((option) => (
                            <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="voice-option"
                                    value={option.voiceName}
                                    checked={selectedVoice === option.voiceName}
                                    onChange={() => setSelectedVoice(option.voiceName)}
                                    className="h-5 w-5 accent-green-500 bg-slate-900 border-slate-600 focus:ring-green-500 focus:ring-2"
                                />
                                <span className="text-gray-300 group-hover:text-green-300 transition-colors">{option.name}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                className="w-full h-40 p-3 bg-slate-900 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-200"
                disabled={isLoading}
            />
            <button
                onClick={handleGenerateSpeech}
                disabled={isLoading || !text.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <Spinner /> : <PlayIcon className="w-6 h-6" />}
                {isLoading ? 'Generating Voice...' : 'Generate Voice'}
            </button>

            {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {audioUrl && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-300">Generated Audio:</h3>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default SingleSpeaker;