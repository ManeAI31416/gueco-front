import React from 'react';

function Gracias() {
  const volverAJugar = () => {
    window.location.href = '/';
  };

  return (
    <div className="gracias">
      <p>¡Gracias por participar!</p>
      <button onClick={volverAJugar} className="button">Volver a jugar</button>
    </div>
  );
}

export default Gracias;