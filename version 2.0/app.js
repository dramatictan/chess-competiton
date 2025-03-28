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
        square.firstChild?.setAttribute('draggable', true) // Set draggable attribute for pieces
        square.setAttribute('square-id', i); // Set unique id for each square, that auto increments and loops

        const row = Math.floor((63 - i) / 8) + 1 // Calculate the row number
        /**
         * chess board have 64 squares, but js is 63 because 0 is consider as 1.
         * 63 - i: Reverse index of the top left square (index 0) corresponding to 8th row (row 1 in chess notation logic)
         * divide 8: Divde the reverse index by 8 (number of squares per row) and round down to get row number 
         * + 1: Adjust row number to start from 1 instead of 0 
         * For example, square id 10 (i), ((63-10) / 8+1) = 7, which is row 7 for chess.
         */
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown"); // Even Row, ? is true so beige
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige") // Odd Row. : is false so beige
        }

        // first 16 square is black based on board
        if (i <= 15) {
            square.firstChild.firstChild.classList.add('black'); // firstChild helps to travel through the element to reach the actual piece
        }
        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }

        gameBoard.append(square);
    })
}
createBoard()

// Select all elements with class square inside the gameboard container
const allSquares = document.querySelectorAll("#gameboard .square");
console.log(allSquares); // Debug only
allSquares.forEach(square => { // loop through each square 
    square.addEventListener('dragstart', dragStart)
    // add dragstart event listener to each square
    // Trigger dragStart function when draggable element is dragged

    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(e) { // To drag something
    // e is the event object which contains info about the event that was trigger
    startPositionId = e.target.parentNode.getAttribute('square-id'); // select the square id attribute from square
    console.log(startPositionId);
    // parentNode is the parent => "square" that contains the piece

    draggedElement = e.target;
}
function dragOver(e) { 
    e.preventDefault();
}
function dragDrop(e) { 
    e.stopPropagation();
    e.target.append(draggedElement);
}