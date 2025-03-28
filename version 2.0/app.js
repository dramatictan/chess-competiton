// Select gameboard container from DOM
const gameBoard = document.querySelector("#gameboard");

// Select player display element from DOM to show whose turn it is
const playerDisplay = document.querySelector("#player");

// Select the info display element from DOM tto show game-related messages
const infoDisplay = document.querySelector("#info-display");

const width = 8; // Define width of chessboard, 8x8 grid

// Define placement pieces at the start
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook, // Black side
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook // White side
]

// function to create chessboard dynamically
function createBoard() {
    // Loop through each element in the array
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div'); // Create div inside gameboard based on append
        square.classList.add("square"); // Add class for styling
        square.innerHTML = startPiece; 
        square.setAttribute('square-id', i); // Set unique id for each square, that auto increments and loops
        square.classList.add('beige'); // Add class for styling
        gameBoard.append(square);
    })
}
createBoard()