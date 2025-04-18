// Select gameboard container from DOM
const gameBoard = document.querySelector("#gameboard");

// Select player display element from DOM to show whose turn it is
const playerDisplay = document.querySelector("#player");

// Select the info display element from DOM tto show game-related messages
const infoDisplay = document.querySelector("#info-display");

const width = 8; // Define width of chessboard, 8x8 grid

let playerGo = 'black';
playerDisplay.textContent = 'white'; // Replace text by id

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
const allSquares = document.querySelectorAll(".square");
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

    draggedElement = e.target; // Store the piece being dragged, so it can be moved to a new square later
}
function dragOver(e) { 
    e.preventDefault(); // Prevent default behavior to allow dropping, allowing the square to accept the drop
}
function dragDrop(e) { 
    e.stopPropagation(); // Stopping event from bubbling up 
    console.log('playerGo', playerGo); // Log player turn
    console.log('e.target', e.target); // Log drop target
    const correctGo = draggedElement.firstChild.classList.contains(playerGo) // Verify if piece has class black or white
    const taken = e.target.classList.contains('piece'); // check if target square (e.target) already contains a piece - for capturing or moving to empty square
    const vaild = checkIfVaild(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white' // if playerGo is white, the opponent is black and vice versa
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo); 

    // Dialogue relating to character.js
    const selectedBotName = playButton.dataset.selectedBot
    const selectedBotDialogues = characterDialogues.find(dialogue => dialogue.name === selectedBotName)?.dialogues;
    console.log(selectedBotDialogues); // Debug only
    const botDialogueElement = document.querySelector("#botDialogue");

    if (correctGo) { // if i am the correct player
        // Must check this first
        if (takenByOpponent && vaild) { // capturing of piece
            e.target.parentNode.append(draggedElement); // drag piece (draggedElement) into square (parentNode)
            e.target.remove(); // Remove occupying piece

            function getRandomDialogueToken(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // Random dialogue for capturing pieces
            if (playerGo === "white") {
                let randomPieceCaptureBetween1and3 = getRandomDialogueToken(1, 3);
                console.log(randomPieceCaptureBetween1and3);
                const dialogueKey = `playerCapture${randomPieceCaptureBetween1and3}`;
                const dialogue = selectedBotDialogues[dialogueKey];
                console.log(dialogue);
                botDialogueElement.textContent = dialogue;
            } else if (playerGo === "black") {
                let randomPieceCaptureBetween1and3 = getRandomDialogueToken(1, 3);
                console.log(randomPieceCaptureBetween1and3);
                const dialogueKey = `botCapture${randomPieceCaptureBetween1and3}`;
                const dialogue = selectedBotDialogues[dialogueKey];
                console.log(dialogue);
                botDialogueElement.textContent = dialogue;
            }

            // Dialogue for Queen Capture
            const queens = Array.from(document.querySelectorAll('#queen'));
            console.log(queens);
            if (!queens.some(queen => queen.firstChild.classList.contains('white'))) {
                const dialogue = selectedBotDialogues.botQueenCapture;
                botDialogueElement.textContent = dialogue;
            } else if (!queens.some(queen => queen.firstChild.classList.contains('black'))) {
                const dialogue = selectedBotDialogues.playerQueenCapture;
                botDialogueElement.textContent = dialogue;
            }

            checkForWin();
            changePlayer();
        return;
        }
        
        // then check this
        if (taken && !takenByOpponent) { // For capturing your own pieces
            infoDisplay.textContent = "Illegal move, try again!"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return;
        }

        if (vaild) {
            e.target.append(draggedElement);

            // Check for pawn promotion
            if (draggedElement.id === "pawn") {
                const targetId = e.target.getAttribute("square-id");
                console.log("Checking for pawn promotion..."); // Debugging
                pawnPromotion(targetId, draggedElement);
            }

            checkForWin();
            changePlayer();
            return;
        }
    }

    // e.target.append(draggedElement);
}

function checkIfVaild(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId)
    const piece = draggedElement.id
    
    console.log('targetId', targetId); // we want to target the square id inside the target, the target is the square
    console.log('startId', startId); // log where the piece started from
    console.log('piece', piece); // log type of piece id from pieces.js

    // piece movement
    switch(piece) {
        case 'pawn': 
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15] // pawn location 

            // First statement: If starterRow includes id 8. And we check 8 + (16) === 24, which means piece will move from 8 to 24, which is vaild
            // Second statement: If starterRow includes id 8, we check 8 + 8 = 16, so piece will move one square up which is on id 16
            // Third statement: Capture left or right, first Child is the piece that can captured on that square Id
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId
                || startId + width === targetId
                || startId + width - 1 === targetId && document.querySelector(`[square-id = "${startId + width - 1}" ]`).firstChild
                || startId + width + 1 === targetId && document.querySelector(`[square-id = "${startId + width + 1}" ]`).firstChild
            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!"
                setTimeout(() => infoDisplay.textContent = "", 2000)
            }
            break;
        case 'knight': 
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId || 
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width - 2 === targetId || 
                startId - width + 2 === targetId
            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!"
                setTimeout(() => infoDisplay.textContent = "", 2000)
            }
            break;
        case 'bishop': 
        if (
            // -- Diagonal Right
            startId + width + 1 === targetId ||
            startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
            startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild ||
            startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild ||
            startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild ||
            startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild ||
            startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6 + 6}"]`).firstChild ||
            // -- Diagonal Left
            startId + width - 1 === targetId ||
            startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
            startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild ||
            startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild ||
            startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild ||
            startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5}"]`).firstChild ||
            startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6 - 6}"]`).firstChild ||
            // -- Diagonal Backward Right
            startId - width + 1 === targetId ||
            startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild ||
            startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild ||
            startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild ||
            startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild ||
            startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild ||
            startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6}"]`).firstChild ||
            // -- Diagonal Backward Left
            startId - width - 1 === targetId ||
            startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild ||
            startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild ||
            startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
            startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
            startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
            startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild
            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!";
                setTimeout(() => infoDisplay.textContent = "", 2000);
            }
            break;
        case 'rook':
            if (
                // -- Up
                startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`).firstChild ||
                // -- Down
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`).firstChild ||
                // -- Left
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild ||
                startId -  4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild ||
                startId -  5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild ||
                startId -  6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  5}"]`).firstChild ||
                startId -  7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  4}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild ||
                // -- Right
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild ||
                startId +  4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild ||
                startId +  5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild ||
                startId +  6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  5}"]`).firstChild ||
                startId +  7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild
            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!";
                setTimeout(() => infoDisplay.textContent = "", 2000);
            }
            break;
        case 'queen':
            if (
                // -- Up
                startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`).firstChild ||
                // -- Down
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`).firstChild ||
                // -- Left
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild ||
                startId -  4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild ||
                startId -  5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild ||
                startId -  6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  5}"]`).firstChild ||
                startId -  7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  4}"]`).firstChild && !document.querySelector(`[square-id = "${startId -  5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild ||
                // -- Right
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild ||
                startId +  4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild ||
                startId +  5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild ||
                startId +  6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  5}"]`).firstChild ||
                startId +  7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId +  3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild ||
                // -- Diagonal Right
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
                startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6 + 6}"]`).firstChild ||
                // -- Diagonal Left
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5}"]`).firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6 - 6}"]`).firstChild ||
                // -- Diagonal Backward Right
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6}"]`).firstChild ||
                // -- Diagonal Backward Left
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild ||
                startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild

            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!";
                setTimeout(() => infoDisplay.textContent = "", 2000);
            }
            break;
        case 'king': 
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width - 1 === targetId ||
                startId + width + 1 === targetId ||
                startId - width - 1  === targetId ||
                startId - width + 1 === targetId
            ) {
                return true;
            } else {
                infoDisplay.textContent = "Illegal move, try again!";
                setTimeout(() => infoDisplay.textContent = "", 2000);
            }
        default:
            console.log('Piece movement not implemented yet.');
            return false;
    }
}

function changePlayer() {
    if (playerGo === "black") {
        reverseIds()
        playerGo = "white"
        playerDisplay.textContent = 'black';
    } else {
        revertIds()
        playerGo = "black"
        playerDisplay.textContent = 'white';
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square"); // Select all element with square
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width * width - 1) - i))
}
function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function pawnPromotion(targetId, draggedElement) {
    
    console.log("Pawn promotion triggered"); // Debugging
    console.log("Target ID:", targetId); // Debugging
    console.log("Dragged Element:", draggedElement); // Debugging

    const promotionBox = document.querySelector("#promotionBox"); // Select the promotion box container
    const promotionalRank = playerGo === "white" ? [0, 1, 2, 3, 4, 5, 6, 7] : [56, 57, 58, 59, 60, 61, 62, 63]; // Last row for white and black pawns
    console.log("Promotional Rank:", promotionalRank); // Debugging

    if (promotionalRank.includes(Number(targetId))) {
        console.log("Pawn is eligible for promotion"); // Debugging
        // Display the promotion options
        promotionBox.innerHTML = `
            <div class="promotion-box">
                <h3>Promote your pawn!</h3>
                <div class="promotion-options">
                    <button class="promotion-option" data-piece="queen">♛ Queen</button>
                    <button class="promotion-option" data-piece="rook">♜ Rook</button>
                    <button class="promotion-option" data-piece="bishop">♝ Bishop</button>
                    <button class="promotion-option" data-piece="knight">♞ Knight</button>
                </div>
            </div>
        `;
        // Add event listeners to the promotion buttons
        document.querySelectorAll(".promotion-option").forEach(button => {
            button.addEventListener("click", (e) => {
                const selectedPiece = e.target.closest("button").dataset.piece; // Get the selected piece from the button
                console.log(`Promoted to: ${selectedPiece}`); // Debugging
    
                // Dynamically update the draggedElement based on the selected piece
                draggedElement.id = selectedPiece; // Update the ID to match the selected piece
                draggedElement.classList.add(selectedPiece); // Add the class for the selected piece
                draggedElement.classList.remove("pawn"); // Remove the "pawn" class
                draggedElement.innerHTML = selectedPiece; // Update the innerHTML to reflect the selected piece
    
                // Clear the promotion box
                promotionBox.innerHTML = '';
            });
        });
    } else {
        console.log("Pawn is not eligible for promotion"); // Debugging
    }
}

function checkForWin() {
    const selectedBotName = playButton.dataset.selectedBot
    const selectedBotDialogues = characterDialogues.find(dialogue => dialogue.name === selectedBotName)?.dialogues;
    console.log(selectedBotDialogues); // Debug only
    const botDialogueElement = document.querySelector("#botDialogue");

    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings)
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "White player wins!"

        const dialogue = selectedBotDialogues.botCheckmate;
        botDialogueElement.textContent = dialogue;

        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square = square.firstChild?.setAttribute('draggable', false))
    }
    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "Black player wins!"

        const dialogue = selectedBotDialogues.playerCheckmate;
        botDialogueElement.textContent = dialogue;
        
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square = square.firstChild?.setAttribute('draggable', false))
    }
}