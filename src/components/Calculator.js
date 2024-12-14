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
  const [isTimestampPending, setIsTimestampPending] = useState(false);
  const [timestampDifference, setTimestampDifference] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [useCustomNumber, setUseCustomNumber] = useState(false);
  const [customNumber, setCustomNumber] = useState('');

  const handleNumber = (num) => {
    if (buttonsDisabled) return;
    if (waitingForOperand) {
      setDisplay(num);
      setCurrentEquation(
        previousValue !== null ? `${previousValue} ${operator} ${num}` : num
      );
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setCurrentEquation(currentEquation === '0' ? num : currentEquation + num);
    }
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return a / b;
      default:
        return b;
    }
  };

  const convertTo12Hour = (hours) => {
    if (hours === 0) return 12;
    if (hours > 12) return hours - 12;
    return hours;
  };

  const handleOperator = (op) => {
    const current = parseFloat(display);

    if (op === '+') {
      let finalValue = current;
      if (operator && !waitingForOperand) {
        finalValue = calculate(previousValue, current, operator);
      }

      if (useCustomNumber) {
        const customValue = parseFloat(customNumber);
        const difference = customValue - finalValue;
        setDisplay(finalValue.toString());
        setCurrentEquation(`${finalValue} +`);

        // Disable all buttons except "="
        setButtonsDisabled(true);

        // Start the animation after a 3-second delay
        setTimeout(() => {
          const diffStr = Math.abs(difference).toString(); // Handle negative differences
          const steps = [];
          for (let i = 1; i <= diffStr.length; i++) {
            steps.push(diffStr.substring(0, i));
          }

          let stepIndex = 0;
          const interval = setInterval(() => {
            const currentStep = steps[stepIndex];
            const newValue = parseInt(currentStep, 10);
            const displayedValue = difference < 0 ? -newValue : newValue;

            setDisplay(displayedValue.toString());
            setCurrentEquation(`${finalValue} + ${displayedValue}`);

            stepIndex += 1;
            if (stepIndex >= steps.length) {
              clearInterval(interval);

              // Update relevant states
              setIsTimestampPending(true);
              setPreviousValue(finalValue);
              setOperator('+');
              setWaitingForOperand(true);
              setTimestampDifference(difference);

              // Re-enable buttons except "="
              setButtonsDisabled(false);
            }
          }, 500);
        }, 3000);

        return;
      }

      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const hours = convertTo12Hour(now.getHours());
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const timestamp = parseInt(
        `${month}${day}${year}${String(hours).padStart(2, '0')}${minutes}`
      );
      const difference = timestamp - finalValue;

      // Disable all buttons except "="
      setButtonsDisabled(true);

      // Show "..." during the initial 3-second delay
      setCurrentEquation(`${finalValue} +`);

      // Start the animation after a 3-second delay
      setTimeout(() => {
        const diffStr = Math.abs(difference).toString(); // Handle negative differences
        const steps = [];
        for (let i = 1; i <= diffStr.length; i++) {
          steps.push(diffStr.substring(0, i));
        }

        let stepIndex = 0;
        const interval = setInterval(() => {
          const currentStep = steps[stepIndex];
          const newValue = parseInt(currentStep, 10);
          const displayedValue = difference < 0 ? -newValue : newValue;

          setDisplay(displayedValue.toString());
          setCurrentEquation(`${finalValue} + ${displayedValue}`);

          stepIndex += 1;
          if (stepIndex >= steps.length) {
            clearInterval(interval);

            // Update relevant states
            setIsTimestampPending(true);
            setPreviousValue(finalValue);
            setOperator('+');
            setWaitingForOperand(true);
            setTimestampDifference(difference);

            // Re-enable buttons except "="
            setButtonsDisabled(false);
          }
        }, 500);
      }, 3000);

      return;
    }

    if (op === '=' && isTimestampPending) {
      const result = calculate(previousValue, timestampDifference, '+');
      setDisplay(`${previousValue}\n+ ${timestampDifference}\n= ${result}`);
      setMultiLine(true);
      setPreviousValue(null);
      setOperator(null);
      setCurrentEquation('');
      setIsTimestampPending(false);
      setTimestampDifference(null);
      setButtonsDisabled(false); // Re-enable all buttons after using "="
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
      return; // Prevent further processing
    }

    // Handle other operators normally
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
  };

  const handleClear = () => {
    setDisplay('0');
    setWaitingForOperand(true);
    setPreviousValue(null);
    setOperator(null);
    setMultiLine(false);
    setCurrentEquation('');
    setIsTimestampPending(false);
    setTimestampDifference(null);
    setButtonsDisabled(false); // Ensure all buttons are enabled after clearing
  };

  const handleOperatorWrapper = (op) => {
    if (buttonsDisabled && !(op === '=' && isTimestampPending)) return;
    handleOperator(op);
  };

  const handleClearWrapper = () => {
    if (buttonsDisabled) return;
    handleClear();
  };

  const handleCalcIconClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleCustomNumberChange = (e) => {
    setCustomNumber(e.target.value);
  };

  const handleUseCustomNumber = () => {
    setUseCustomNumber(true);
    // Keep the popup open to allow input
  };

  const handleUseTimestamp = () => {
    setUseCustomNumber(false);
    setShowPopup(false);
  };

  return (
    <div className="calculator">
      <div className={`display ${multiLine ? 'multiline' : ''}`}>
        {currentEquation || display}
      </div>
      <div className="buttons">
        <button
          className="gray"
          onClick={handleClearWrapper}
          disabled={buttonsDisabled}
        >
          AC
        </button>
        <button
          className="gray"
          onClick={() => handleNumber('+/-')}
          disabled={buttonsDisabled}
        >
          +/-
        </button>
        <button
          className="gray"
          onClick={() => handleNumber('%')}
          disabled={buttonsDisabled}
        >
          %
        </button>
        <button
          className="orange"
          onClick={() => handleOperatorWrapper('÷')}
          disabled={buttonsDisabled}
        >
          ÷
        </button>

        <button onClick={() => handleNumber('7')} disabled={buttonsDisabled}>
          7
        </button>
        <button onClick={() => handleNumber('8')} disabled={buttonsDisabled}>
          8
        </button>
        <button onClick={() => handleNumber('9')} disabled={buttonsDisabled}>
          9
        </button>
        <button
          className="orange"
          onClick={() => handleOperatorWrapper('×')}
          disabled={buttonsDisabled}
        >
          ×
        </button>

        <button onClick={() => handleNumber('4')} disabled={buttonsDisabled}>
          4
        </button>
        <button onClick={() => handleNumber('5')} disabled={buttonsDisabled}>
          5
        </button>
        <button onClick={() => handleNumber('6')} disabled={buttonsDisabled}>
          6
        </button>
        <button
          className="orange"
          onClick={() => handleOperatorWrapper('-')}
          disabled={buttonsDisabled}
        >
          -
        </button>

        <button onClick={() => handleNumber('1')} disabled={buttonsDisabled}>
          1
        </button>
        <button onClick={() => handleNumber('2')} disabled={buttonsDisabled}>
          2
        </button>
        <button onClick={() => handleNumber('3')} disabled={buttonsDisabled}>
          3
        </button>
        <button
          className="orange"
          onClick={() => handleOperatorWrapper('+')}
          disabled={buttonsDisabled}
        >
          +
        </button>

        <button disabled={buttonsDisabled} onClick={handleCalcIconClick}>
          <img src={calcIcon} alt="calculator" className="calculator-icon" />
        </button>
        <button onClick={() => handleNumber('0')} disabled={buttonsDisabled}>
          0
        </button>
        <button onClick={() => handleNumber('.')} disabled={buttonsDisabled}>
          .
        </button>
        <button
          className="orange"
          onClick={() => handleOperatorWrapper('=')}
          disabled={buttonsDisabled && !isTimestampPending}
        >
          =
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <button onClick={handleUseTimestamp}>Use Timestamp</button>
          <button onClick={handleUseCustomNumber}>Use Custom Number</button>
          {useCustomNumber && (
            <input
              type="number"
              value={customNumber}
              onChange={handleCustomNumberChange}
              placeholder="Enter custom number"
            />
          )}
          <button onClick={handlePopupClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Calculator;