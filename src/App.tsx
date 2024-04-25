import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbox from './components/Chatbox';
import Gracias from './components/Gracias';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/" element={<Chatbox />} />
      </Routes>
    </Router>
  );
}

export default App;
