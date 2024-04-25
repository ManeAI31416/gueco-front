import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useSpeechToText = () => {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
    const startListening = () => {
      if (!browserSupportsSpeechRecognition) {
        console.log('El navegador no soporta el reconocimiento de voz.');
        return;
      }
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    };
  
    return { transcript, resetTranscript, startListening };
  };
  
  export default useSpeechToText;