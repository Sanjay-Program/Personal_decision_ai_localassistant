import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

/**
 * Mobile 'Live' Voice Control
 * Handles local Speech-to-Text and Text-to-Speech
 */
export class VoicePlugin {
    private onResultsCallback: (text: string) => void = () => {};

    constructor() {
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
    }

    private onSpeechResults(e: any) {
        if (e.value && e.value.length > 0) {
            this.onResultsCallback(e.value[0]);
        }
    }

    async startListening(callback: (text: string) => void) {
        this.onResultsCallback = callback;
        try {
            await Voice.start('en-US');
            console.log("Voice listening started...");
        } catch (e) {
            console.error(e);
        }
    }

    async stopListening() {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    }

    speak(text: string) {
        Tts.speak(text);
    }
}

export const voicePlugin = new VoicePlugin();
