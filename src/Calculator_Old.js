import React, { useState } from 'react';
import './Calculator.css';
import calcIcon from './calc.png';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [multiLine, setMultiLine] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [currentEquation, setCurrentEquation] = useState('');

  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(num);
      setCurrentEquation(previousValue !== null ? `${previousValue} ${operator} ${num}` : num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setCurrentEquation(currentEquation === '0' ? num : currentEquation + num);
    }
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleOperator = (op) => {
    const current = parseFloat(display);

    if (op === '+') {
      let finalValue = current;
      if (operator && !waitingForOperand) {
        finalValue = calculate(previousValue, current, operator);
      }

      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const timestamp = parseInt(`${month}${day}${year}${hours}${minutes}`);
      const difference = timestamp - finalValue;
      
      setDisplay(`${finalValue}\n+ ${difference}\n= ${timestamp}`);
      setMultiLine(true);
      setPreviousValue(null);
      setOperator(null);
      setCurrentEquation('');
      return;
    }

    if (op === '=') {
      if (operator && !waitingForOperand) {
        const result = calculate(previousValue, current, operator);
        setDisplay(result.toString());
        setPreviousValue(null);
        setOperator(null);
        setCurrentEquation('');
      }
    } else {
      if (operator && !waitingForOperand) {
        const result = calculate(previousValue, current, operator);
        setDisplay(result.toString());
        setPreviousValue(result);
        setCurrentEquation(`${result} ${op}`);
      } else {
        setPreviousValue(current);
        setCurrentEquation(`${current} ${op}`);
      }
      setOperator(op);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setWaitingForOperand(true);
    setPreviousValue(null);
    setOperator(null);
    setMultiLine(false);
    setCurrentEquation('');
  };

  return (
    <div className="calculator">
      <div className={`display ${multiLine ? 'multiline' : ''}`}>
        {currentEquation || display}
      </div>
      <div className="buttons">
        <button className="gray" onClick={handleClear}>AC</button>
        <button className="gray" onClick={() => handleNumber('+/-')}>+/-</button>
        <button className="gray" onClick={() => handleNumber('%')}>%</button>
        <button className="orange" onClick={() => handleOperator('÷')}>÷</button>
        
        <button onClick={() => handleNumber('7')}>7</button>
        <button onClick={() => handleNumber('8')}>8</button>
        <button onClick={() => handleNumber('9')}>9</button>
        <button className="orange" onClick={() => handleOperator('×')}>×</button>
        
        <button onClick={() => handleNumber('4')}>4</button>
        <button onClick={() => handleNumber('5')}>5</button>
        <button onClick={() => handleNumber('6')}>6</button>
        <button className="orange" onClick={() => handleOperator('-')}>-</button>
        
        <button onClick={() => handleNumber('1')}>1</button>
        <button onClick={() => handleNumber('2')}>2</button>
        <button onClick={() => handleNumber('3')}>3</button>
        <button className="orange" onClick={() => handleOperator('+')}>+</button>
        
        <button>
          <img src={calcIcon} alt="calculator" className="calculator-icon" />
        </button>
        <button onClick={() => handleNumber('0')}>0</button>
        <button onClick={() => handleNumber('.')}>.</button>
        <button className="orange" onClick={() => handleOperator('=')}>=</button>
      </div>
    </div>
  );
}

export default Calculator;