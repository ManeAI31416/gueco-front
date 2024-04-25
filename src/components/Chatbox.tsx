// components/Chatbox.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition from 'react-speech-recognition';
import useSpeechToText from '../hooks/useSpeechToText';

function Chatbox() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [chat, setChat] = useState<{ mensaje: string, enviado: boolean }[]>([]);
  const [siguiente, setSiguiente] = useState(false);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const { transcript, resetTranscript, startListening } = useSpeechToText();
  const [isListening, setIsListening] = useState(false);

  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Cancela todos los mensajes en la cola
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Establece el idioma a español
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/pregunta')
      .then(response => {
        setPregunta(response.data.pregunta);
        setChat([{ mensaje: response.data.pregunta, enviado: false }]);
        speak(response.data.pregunta); // Habla la pregunta
      });
  }, []);

  useEffect(() => {
    if (isListening) {
      setRespuesta(transcript);
    }
  }, [transcript]);

  const enviarRespuesta = () => {
    if (!respuesta.trim()) {
      alert('El campo debe contener información');
      return;
    }

    setChat(chatAnterior => [...chatAnterior, { mensaje: respuesta, enviado: true }]);
    setRespuestaEnviada(true);
    setEsperandoRespuesta(true);

    axios.post('http://127.0.0.1:5000/procesar', new URLSearchParams({ respuesta }))
      .then(response => {
        setEsperandoRespuesta(false);
        setChat(chatAnterior => [...chatAnterior, { mensaje: response.data.retroalimentacion, enviado: false }]);
        speak(response.data.retroalimentacion); // Habla la retroalimentación
        setSiguiente(true);
      });
  };

  const handleSiClick = () => {
    window.location.reload();
  };

  const handleNoClick = () => {
    window.location.href = '/gracias';
  };

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Reinicia el transcript cada vez que inicies el reconocimiento de voz
      startListening();
    }
    setIsListening(!isListening);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="chatbox">
        {chat.map((mensaje, index) => (
          <p key={index} className={mensaje.enviado ? 'enviado' : 'recibido'}>
            {mensaje.mensaje}
          </p>
        ))}
        {esperandoRespuesta && <p>Esperando respuesta de GEKO...</p>}
        {!siguiente && !respuestaEnviada && (
          <div>
            <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)} rows={4}></textarea>
            <button onClick={enviarRespuesta} className="button">Enviar</button>
            <button onClick={toggleListening} className="button">{isListening ? 'Detener' : 'Iniciar'}</button>
          </div>
        )}
        {siguiente && (
          <div>
            <p>¿Deseas pasar a la siguiente pregunta?</p>
            <button onClick={handleSiClick} className="button">Sí</button>
            <button onClick={handleNoClick} className="button">No</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbox;
