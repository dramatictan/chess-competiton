// Select gameboard container from DOM
const gameBoard = document.querySelector("#gameboard");

// Select player display element from DOM to show whose turn it is
const playerDisplay = document.querySelector("#player");

// Select the info display element from DOM tto show game-related messages
const infoDisplay = document.querySelector("#info-display");

const width = 8; // Define width of chessboard, 8x8 grid

let playerGo = 'black';
playerDisplay.textContent = 'white'; // Replace text by id

// New chessboard with surround sea terrains and new chess pieces
// 18 x 12 grid
// Select the gameboard container

// Ensure the gameboard exists
if (!gameBoard) {
    console.error("Error: #gameboard element not found in the DOM.");
}

// Corrected board layout
const boardLayout = [
    Array(18).fill("water"), // Row 1
    Array(18).fill("water"), // Row 2
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 3
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 4
    ["water", "water", ...Array(11).fill("land"), "water", "water", "water", "water", "water"], // Row 5
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 6
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 7
    ["water", "water", "water", "water", "water", ...Array(11).fill("land"), "water", "water"], // Row 8
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 9
    ["water", "water", ...Array(14).fill("land"), "water", "water"], // Row 10
    Array(18).fill("water"), // Row 11
    Array(18).fill("water"), // Row 12
];

// Generate the board dynamically
boardLayout.forEach((row, rowIndex) => {
    row.forEach((squareType, colIndex) => {
        const square = document.createElement("div");
        square.classList.add("square", squareType);

        // Apply checkered pattern
        if (squareType === "water") {
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? "cyan" : "blue");
        } else if (squareType === "land") {
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? "beige" : "brown");
        }

        gameBoard.appendChild(square);
    });
});

// Ensure the correct number of squares are generated
const totalSquares = boardLayout.reduce((sum, row) => sum + row.length, 0);
console.log(`Total squares generated: ${totalSquares}`); // Should log 216