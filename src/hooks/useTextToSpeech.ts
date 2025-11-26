import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    selectVoice: (voice: SpeechSynthesisVoice) => void;
    hasSynthesisSupport: boolean;
}

export const useTextToSpeech = (): TextToSpeechHook => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSynth(window.speechSynthesis);

            const updateVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Try to select a good default voice (Google US English or Microsoft David/Zira)
                const defaultVoice = availableVoices.find(v =>
                    (v.name.includes('Google') && v.lang === 'en-US') ||
                    (v.name.includes('Microsoft') && v.lang.includes('en-US'))
                ) || availableVoices[0];

                if (defaultVoice) {
                    setSelectedVoice(defaultVoice);
                }
            };

            updateVoices();

            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = updateVoices;
            }
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (synth && selectedVoice) {
            // Cancel any current speaking
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setIsSpeaking(false);
            };

            synth.speak(utterance);
        }
    }, [synth, selectedVoice]);

    const stop = useCallback(() => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
        }
    }, [synth]);

    const selectVoice = useCallback((voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);
    }, []);

    return {
        speak,
        stop,
        isSpeaking,
        voices,
        selectedVoice,
        selectVoice,
        hasSynthesisSupport: !!synth,
    };
};
