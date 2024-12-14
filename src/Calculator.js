// src/Calculator.js
import React, { useState } from 'react';
import './Calculator.css';
import calcIcon from './calc.png';

function Calculator() {
  const [display, setDisplay] = useState('');

  const handleButtonClick = (value) => {
    setDisplay((prev) => prev + value);
  };

  const handleClear = () => {
    setDisplay('');
  };

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display || '0'}</div>
      <div className="buttons">
        <button className="gray" onClick={handleClear}>AC</button>
        <button className="gray" onClick={() => handleButtonClick('+/-')}>+/-</button>
        <button className="gray" onClick={() => handleButtonClick('%')}>%</button>
        <button className="orange" onClick={() => handleButtonClick('/')}>÷</button>
        <button onClick={() => handleButtonClick('7')}>7</button>
        <button onClick={() => handleButtonClick('8')}>8</button>
        <button onClick={() => handleButtonClick('9')}>9</button>
        <button className="orange" onClick={() => handleButtonClick('*')}>×</button>
        <button onClick={() => handleButtonClick('4')}>4</button>
        <button onClick={() => handleButtonClick('5')}>5</button>
        <button onClick={() => handleButtonClick('6')}>6</button>
        <button className="orange" onClick={() => handleButtonClick('-')}>−</button>
        <button onClick={() => handleButtonClick('1')}>1</button>
        <button onClick={() => handleButtonClick('2')}>2</button>
        <button onClick={() => handleButtonClick('3')}>3</button>
        <button className="orange" onClick={() => handleButtonClick('+')}>+</button>
        <button>
          <img 
            src={calcIcon} 
            alt="calculator"
            className="calculator-icon"
          />
        </button>
        <button className="zero" onClick={() => handleButtonClick('0')}>0</button>
        <button className="dot" onClick={() => handleButtonClick('.')}>.</button>
        <button className="orange" onClick={handleCalculate}>=</button>
      </div>
    </div>
  );
}

export default Calculator;