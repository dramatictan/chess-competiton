// Select gameboard container from DOM
const gameBoard = document.querySelector("#gameboard");

// Select player display element from DOM to show whose turn it is
const playerDisplay = document.querySelector("#player");

// Select the info display element from DOM tto show game-related messages
const infoDisplay = document.querySelector("#info-display");

const width = 8; // Define width of chessboard, 8x8 grid

let playerGo = 'black';
playerDisplay.textContent = 'white'; // Replace text by id

const startPieces = [
    
]