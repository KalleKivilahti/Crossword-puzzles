import React, { useState, useRef } from 'react';
import { words } from '../words';

const Generator = () => {
  const [grid, setGrid] = useState([]);
  const [hints, setHints] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctness, setCorrectness] = useState([]);
  const [wordNumbers, setWordNumbers] = useState([]);
  const inputRefs = useRef([]);

  const GRID_SIZE = 10;

  const generatePuzzle = () => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''));
    const newHints = [];
    const newWordNumbers = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    const selectedWords = getRandomWords(15);
    let validWords = 0;

    selectedWords.forEach((wordObj, index) => {
      const { word, hint } = wordObj;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * (GRID_SIZE - word.length));

      if (canPlaceWordHorizontally(newGrid, word, row, col)) {
        placeWordHorizontally(newGrid, word, row, col);
        newHints.push(hint);
        newWordNumbers[row][col] = validWords + 1; 
        validWords++;
      } else {
        const colVertical = Math.floor(Math.random() * GRID_SIZE);
        if (canPlaceWordVertically(newGrid, word, row, colVertical)) {
          placeWordVertically(newGrid, word, row, colVertical);
          newHints.push(hint);
          newWordNumbers[row][colVertical] = validWords + 1;
          validWords++;
        }
      }
    });

    if (validWords > 0) {
      setGrid(newGrid);
      setHints(newHints);
      setUserAnswers(newGrid.map(row => Array(GRID_SIZE).fill('')));
      setCorrectness(newGrid.map(row => Array(GRID_SIZE).fill(null)));
      setWordNumbers(newWordNumbers);
      inputRefs.current = [];
    } else {
      alert("No valid words could be placed in the puzzle.");
    }
  };

  const getRandomWords = (count) => {
    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, count);
    return selectedWords;
  };

  const canPlaceWordHorizontally = (grid, word, row, col) => {
    if (col + word.length > GRID_SIZE) return false;
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[row][col + i];
      if (currentCell !== '' && currentCell !== word[i]) return false; 
    }
    return true;
  };

  const canPlaceWordVertically = (grid, word, row, col) => {
    if (row + word.length > GRID_SIZE) return false;
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[row + i][col];
      if (currentCell !== '' && currentCell !== word[i]) return false; 
    }
    return true;
  };

  const placeWordHorizontally = (grid, word, row, col) => {
    for (let i = 0; i < word.length; i++) {
      grid[row][col + i] = word[i].toUpperCase();
    }
  };

  const placeWordVertically = (grid, word, row, col) => {
    for (let i = 0; i < word.length; i++) {
      grid[row + i][col] = word[i].toUpperCase();
    }
  };

  const handleInputChange = (row, col, value) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[row][col] = value.toUpperCase();
    setUserAnswers(newUserAnswers);

    if (value && col < grid[row].length - 1) {
      inputRefs.current[row][col + 1].focus();
    } else if (value === '' && col > 0) {
      inputRefs.current[row][col - 1].focus();
    }
  };

  const handleKeyDown = (e, row, col) => {
    const key = e.key;

    if (key === 'ArrowRight' && col < grid[row].length - 1) {
      inputRefs.current[row][col + 1].focus();
    } else if (key === 'ArrowLeft' && col > 0) {
      inputRefs.current[row][col - 1].focus();
    } else if (key === 'ArrowDown' && row < grid.length - 1) {
      inputRefs.current[row + 1][col].focus();
    } else if (key === 'ArrowUp' && row > 0) {
      inputRefs.current[row - 1][col].focus();
    } else if (key === 'Backspace') {
      if (userAnswers[row][col]) {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[row][col] = '';
        setUserAnswers(newUserAnswers);
      } else {
        if (col > 0) {
          inputRefs.current[row][col - 1].focus();
        } else if (row > 0) {
          inputRefs.current[row - 1][grid[row - 1].length - 1].focus();
        }
      }
    } else if (key === 'Enter') {
      checkAnswers();
    } else {
      if (!/[a-zA-Z]/.test(key) && key.length === 1) {
        e.preventDefault();
      }
    }
  };

  const checkAnswers = () => {
    const newCorrectness = correctness.map(row => [...row]);
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell && userAnswers[rowIndex][colIndex]) {
          newCorrectness[rowIndex][colIndex] = userAnswers[rowIndex][colIndex].toUpperCase() === cell.toUpperCase();
        }
      });
    });
    setCorrectness(newCorrectness);
  };

  const showAnswers = () => {
    setUserAnswers(grid.map(row => [...row]));
  };

  return (
    <div className="text-center">
      <button 
        onClick={generatePuzzle} 
        className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Generate Puzzle
      </button>
      <button 
        onClick={checkAnswers}
        className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        Check Answers
      </button>
      <button 
        onClick={showAnswers}
        className="mt-4 px-4 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Show Answers
      </button>
      <div className="mt-4">
        <div className="flex flex-col items-center">
          {grid.length > 0 && grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                cell ? (
                  <div key={colIndex} style={{ position: 'relative', margin: '2px' }}>
                    <input
                      type="text"
                      maxLength="1"
                      value={userAnswers[rowIndex][colIndex] || ''}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      ref={el => {
                        if (!inputRefs.current[rowIndex]) {
                          inputRefs.current[rowIndex] = [];
                        }
                        inputRefs.current[rowIndex][colIndex] = el;
                      }}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '24px',
                        textAlign: 'center',
                        transition: 'border-color 0.3s',
                        backgroundColor: correctness[rowIndex][colIndex] === true ? 'green' : correctness[rowIndex][colIndex] === false ? 'red' : '#333',
                        color: '#fff',
                        width: '40px',
                      }}
                    />
                    {wordNumbers[rowIndex][colIndex] && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '0', 
                        left: '0', 
                        fontSize: '12px', 
                        color: 'white',
                        backgroundColor: 'black',
                        padding: '0 3px',
                        borderRadius: '50%',
                      }}>
                        {wordNumbers[rowIndex][colIndex]}
                      </span>
                    )}
                  </div>
                ) : (
                  <div key={colIndex} style={{ width: '40px', margin: '2px' }}></div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Hints:</h3>
        <ul className="list-disc">
          {hints.map((hint, index) => (
            <li key={index}>{index + 1}. {hint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Generator;
