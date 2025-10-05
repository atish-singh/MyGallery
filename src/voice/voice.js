import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

let Voice;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch {}
}

let onStartCb = () => {};
let onResultsCb = () => {};
let onErrorCb = () => {};

if (Voice) {
  Voice.onSpeechStart = () => onStartCb();
  Voice.onSpeechResults = (e) => onResultsCb(e);
  Voice.onSpeechError = (e) => onErrorCb(e);
}

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    onStartCb = () => setIsListening(true);
    onResultsCb = (e) => {
      const value = e.value?.[0] || '';
      setTranscript(value);
      setIsListening(false);
    };
    onErrorCb = (e) => {
      setError(e);
      setIsListening(false);
    };
    return () => {
      if (Voice) {
        Voice.destroy().catch(() => {});
      }
    };
  }, []);

  return { isListening, transcript, error };
}

export async function startVoice() {
  if (Platform.OS === 'web') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = 'en-US';
    recog.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      onResultsCb({ value: [text] });
    };
    recog.onerror = (e) => onErrorCb(e);
    recog.start();
    onStartCb();
    return;
  }
  if (!Voice) return;
  try {
    await Voice.start('en-US');
  } catch (e) {
    onErrorCb(e);
  }
}

export async function stopVoice() {
  if (Platform.OS === 'web') {
    // Web Speech API instance is local; we can't stop globally without reference.
    onErrorCb(null);
    return;
  }
  if (!Voice) return;
  try {
    await Voice.stop();
  } catch (e) {
    onErrorCb(e);
  }
}


