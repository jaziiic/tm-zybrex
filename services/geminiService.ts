
import { GoogleGenAI, Modality } from "@google/genai";
import { SpeakerConfig } from "../types";

// This check is to prevent crashing in non-browser environments or during SSR.
const apiKey = typeof process === 'undefined' ? '' : process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const ttsModel = "gemini-2.5-flash-preview-tts";

/**
 * Generates speech for a single speaker.
 * @param text The text to convert to speech.
 * @param voiceName The name of the prebuilt voice to use.
 * @returns A base64 encoded audio string.
 */
export async function generateSingleSpeakerSpeech(text: string, voiceName: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error in generateSingleSpeakerSpeech:", error);
        throw new Error("Failed to generate single speaker speech.");
    }
}

/**
 * Generates speech for a multi-speaker conversation.
 * @param text The conversational script.
 * @param speakers An array of speaker configurations.
 * @returns A base64 encoded audio string.
 */
export async function generateMultiSpeakerSpeech(text: string, speakers: SpeakerConfig[]): Promise<string> {
    try {
        const speakerVoiceConfigs = speakers.map(s => ({
            speaker: s.speaker,
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: s.voiceName }
            }
        }));

        const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [{ parts: [{ text: `TTS the following conversation: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: speakerVoiceConfigs
                    }
                }
            }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API for multi-speaker request.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error in generateMultiSpeakerSpeech:", error);
        throw new Error("Failed to generate multi-speaker speech.");
    }
}
