let legalSquares = [];
/**
 * This is required to store IDs of squares where a piece can legally move
 */


let isWhiteTurn = true; // Set white turn to move first

// Get all squares and pieces on the chessboard
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");

// Initialise the board and pieces
setupBoardSquares();
setupPieces();

// Set up board squares with event listeners and IDs
function setupBoardSquares() {
    for (let i = 0; i < boardSquares.length; i++) {
        // Allow dropping on the squares
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);

        // Calculate the row and column for the square
        let row = 8 - Math.floor(i/8); // Rows are numbered from 8 to 1 
        // Explanation: 
        // - Math.floor(i / 8) gives the row index (0 to 7).
        // - Subtracting this value from 8 converts it to the chess notation row (8 to 1).

        let column = String.fromCharCode(97+(i%8)); // Columns are lettered 'a' to 'h'
        // Explanation: 
        // - i % 8 gives the column index (0 to 7).
        // - Adding this index to 97 (ASCII value for 'a') and converting to a character gives the column letter (a to h).

        // Set ID of square to its chess notation
        let square = boardSquares[i];
        square.id = column + row; // Combines the column letter and row number
    }
}

// Function to set up the pieces with event listeners and IDs
function setupPieces() {
    // Loop through all the pieces on the board
    for (let i = 0; i < pieces.length; i++) {
        // Allow dragging of the pieces
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);

        // Set the id of the piece to it's type and position (eg: rook_a8)
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
        // Explanation:
        // - pieces[i].className.split(" ")[1] gets the type of the piece (e.g., "rook", "knight").
        // - pieces[i].parentElement.id gets the ID of the parent square (e.g., "a8").
        // - Combining these gives a unique ID for the piece (e.g., "rook_a8").
    }
    // Prevent dragging of the pieces images themselves
    for (let i = 0; i < piecesImages.length; i++) {
        piecesImages[i].setAttribute("draggable", false);
    }
}

// Allow dropping of piece on a square
function allowDrop(ev) {
    ev.preventDefault(); // Prevent default behavior to allow dropping
}

// function to drag a piece
function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");

    // check if the correct turn for the piece color 
    if ((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")) {
        // Store id of the piece being dragged in the dataTransfer object
        ev.dataTransfer.setData("text", piece.id);
        const startingSquareId = piece.parentNode.id;
        getPossibleMoves(startingSquareId, piece) 
    }
}

// function to drop a piece on a square
function drop(ev) {
    ev.preventDefault();
    // Get the ID of the piece being dragged from the dataTransfer object
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    // Explanation:
    // - ev.dataTransfer.getData("text") retrieves the stored data (the ID of the piece).
    // - document.getElementById(data) gets the piece element using the retrieved ID.

    // Get the square where the piece is being dropped
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;
    // Explanation:
    // - ev.currentTarget refers to the element that the event handler is attached to (the square).
    // - destinationSquare.id gets the ID of the destination square
    // (not used further in this function, but could be useful for additional logic).

    if ((isSquareOccupied(destinationSquare) == "blank") && (legalSquares.includes(destinationSquareId)) ) {
        // First Statement: if the square where the piece is travelling to is blank, proceed
        // Second Statement: if the destination square is a legal move for the piece

        // Append the piece to the destination square
        destinationSquare.appendChild(piece);
        // - destinationSquare.appendChild(piece) moves the piece element to the destination square.
        // - This effectively updates the position of the piece on the board.

        isWhiteTurn = !isWhiteTurn; // Toggle the turn after you drop. So let say u drop black, then it is white turn to drop, but not black
        legalSquares.length = 0 // Reset legalSquares array to 0 after making a move. Must reset to remove old legal moves to prevent incorrect behaviors
        return;
    }

    if ((isSquareOccupied(destinationSquare) != "blank") && (legalSquares.includes(destinationSquareId)) ) {
        while (destinationSquare.firstChild) {
            destinationSquare.removeChild(destinationSquare.firstChild); // Remove piece
        }
        destinationSquare.appendChild(piece); // Replace captured piece with that new piece
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0; // Reset legalSquares array to 0 after making a move. Must reset to remove old legal moves to prevent incorrect behaviors
        return;
    }
}

function getPossibleMoves(startingSquareId, piece) {
    const pieceColor = piece.getAttribute("color");
    if (piece.classList.contains("pawn")) { // if Piece is a pawn
        getPawnMoves(startingSquareId, pieceColor); // Determine legal moves for pawns
    }

}

// Enable capturing and prevent pieces from moving to occupied squares
function isSquareOccupied (square) {
    // Check if square contains a piece
    if (square.querySelector(".piece")) {
        // if there is a piece, get its color attribute
        const color = square.querySelector(".piece").getAttribute("color");
        return color; // Return color of the piece
    } else {
        return "blank"; // If no piece is found, return blank
    }
}





function getPawnMoves(startingSquareId, pieceColor) {
    checkPawnDiagonalCapture(startingSquareId, pieceColor);
    checkPawnForwardMoves(startingSquareId, pieceColor);
}
function checkPawnDiagonalCapture(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor == "white" ? 1 : -1;

    // Check the two diagonal squares in front of the pawn
    let currentRank = rankNumber + direction;

    for (let i = -1; i <= 1; i += 2) {
        let currentFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (currentFile >= "a" && currentFile <= "h") {
            let currentSquareId = currentFile + currentRank;
            let currentSquare = document.getElementById(currentSquareId);
            let squareContent = isSquareOccupied(currentSquare);

            if (squareContent != "blank" && squareContent != pieceColor) {
                legalSquares.push(currentSquareId);
            }
        }
    }
}
function checkPawnForwardMoves(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor == "white" ? 1 : -1;

    // Check the square directly in front of the pawn
    let currentRank = rankNumber + direction;
    let currentSquareId = file + currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);

    if (squareContent == "blank") {
        legalSquares.push(currentSquareId);

        // Check if the pawn can move two squares forward from its starting position
        if ((pieceColor == "white" && rankNumber == 2) || (pieceColor == "black" && rankNumber == 7)) {
            currentRank += direction;
            currentSquareId = file + currentRank;
            currentSquare = document.getElementById(currentSquareId);
            squareContent = isSquareOccupied(currentSquare);

            if (squareContent == "blank") {
                legalSquares.push(currentSquareId);
            }
        }
    }
}