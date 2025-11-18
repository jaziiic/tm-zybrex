import React, { useState, useCallback } from 'react';
import { generateMultiSpeakerSpeech } from '../services/geminiService';
import { pcmToWavBlob, decode, decodeAudioData } from '../utils/audioUtils';
import Spinner from './shared/Spinner';
import { SpeakerConfig } from '../types';
import { PlayIcon } from './icons/PlayIcon';

// The Gemini API currently supports exactly 2 speakers for multi-speaker TTS.
const SPEAKERS: SpeakerConfig[] = [
    { speaker: 'Baby 1', voiceName: 'Puck' },
    { speaker: 'Baby 2', voiceName: 'Kore' },
];

const initialText = `Baby 1: Hi there! Let's build a tower.
Baby 2: Yes! A big, big tower!
Baby 1: I have a red block.
Baby 2: I have a blue one! This will be fun.`;

const MultiSpeaker: React.FC = () => {
    const [text, setText] = useState<string>(initialText);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSpeech = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter a script to generate speech.');
            return;
        }

        setIsLoading(true);
        setError(null);
        if(audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);

        try {
            const base64Audio = await generateMultiSpeakerSpeech(text, SPEAKERS);
            
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);

            const pcmData = audioBuffer.getChannelData(0);
            const wavBlob = pcmToWavBlob(pcmData, 24000);
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);

        } catch (err) {
            console.error('Error generating multi-speaker speech:', err);
            setError('Failed to generate speech. Ensure script format is correct and check console.');
        } finally {
            setIsLoading(false);
        }
    }, [text, audioUrl]);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2 text-green-400">Multi-Speaker Mode</h2>
             <div className="mb-4 p-3 bg-slate-900/70 rounded-md border border-slate-600">
                <p className="text-sm text-gray-400 mb-2">Format your script with the speaker name followed by a colon on each line. The available speakers are:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {SPEAKERS.map((s) => (
                        <code key={s.speaker} className="text-green-300 bg-green-900/50 px-2 py-1 rounded text-sm">{s.speaker}</code>
                    ))}
                </div>
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter script here, e.g.,&#10;Baby 1: Hello world!&#10;Baby 2: Hi there!"
                className="w-full h-48 p-3 bg-slate-900 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-200"
                disabled={isLoading}
            />
            <button
                onClick={handleGenerateSpeech}
                disabled={isLoading || !text.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <Spinner /> : <PlayIcon className="w-6 h-6" />}
                {isLoading ? 'Generating Voices...' : 'Generate Conversation'}
            </button>

            {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {audioUrl && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-300">Generated Conversation:</h3>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default MultiSpeaker;