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
    if (piece.classList.contains("knight")) {
        getKnightMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("rook")) {
        getRookMoves(startingSquareId, pieceColor);
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
    // Starting square ID: id of square where pawn is located, "e2"
    // pieceColor is color of pawn, white or black
    checkPawnDiagonalCapture(startingSquareId, pieceColor);
    checkPawnForwardMoves(startingSquareId, pieceColor);
}
function checkPawnDiagonalCapture(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0); // Extract file (column) from square ID (eg. "e" from e2)
    const rank = startingSquareId.charAt(1); // Extract rank (row) from square ID (eg. "2" from e2)
    const rankNumber = parseInt(rank); // convert rank into number - "2" -> 2
    const direction = pieceColor == "white" ? 1 : -1; // Determine direction of movement, white move positively up, while black moves down which is negative

    // Check the two diagonal squares in front of the pawn
    let currentRank = rankNumber + direction;

    for (let i = -1; i <= 1; i += 2) { // Loop through two diagonal directions (-1 for left, +1 for right)
        let currentFile = String.fromCharCode(file.charCodeAt(0) + i); // Calculate the file of the diagonal square
        if (currentFile >= "a" && currentFile <= "h") { // Ensure file is within board space
            let currentSquareId = currentFile + currentRank; // Combine file and rank to get the square ID
            let currentSquare = document.getElementById(currentSquareId); // get the square element
            let squareContent = isSquareOccupied(currentSquare); // check if square is occupied

            if (squareContent != "blank" && squareContent != pieceColor) { // if square is occupied by opponent's piece
                legalSquares.push(currentSquareId); // Add the square to list of legal moves because pawns can capture diagonally
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

    if (squareContent == "blank") { // if the square is empty
        legalSquares.push(currentSquareId); // add square to list of legal space because pawns can move forward if not blocked

        // Check if the pawn can move two squares forward from its starting position
        if ((pieceColor == "white" && rankNumber == 2) || (pieceColor == "black" && rankNumber == 7)) {
            currentRank += direction; // Move 1 more rank forward
            currentSquareId = file + currentRank; // get new square ID
            currentSquare = document.getElementById(currentSquareId); // get square element
            squareContent = isSquareOccupied(currentSquare); // check if square is occupied

            if (squareContent == "blank") {
                legalSquares.push(currentSquareId);
            }
        }
    }
}

function getKnightMoves(startingSquareId, pieceColor) {
    const file = startingSquareId.charCodeAt(0)-97;
    // Explanation:
    // 'startingSquareId.charCodeAt(0)' gets the ASCII code of the file (eg, 'a' -> 97, 'b' -> 98)
    // Subtracting 97 makes it 0, so 'a' -> 1, 'b' -> 2
    const rank = startingSquareId.charAt(1); // Extracts the rank
    const rankNumber = parseInt(rank); // convert rank to number
    let currentFile = file; // (0-7) 
    let currentRank = rankNumber; // (1-8) 

    // Knights moves in an "L" shape. Two square in one direction and then one square perpendicular to it
    const moves = [
        // Each array represets [file offset, rank offset]
        [-2,1], [-1,2], [1,2], [2,1], // Moves in positive direction
        [2,-1], [1,-2], [-1,-2], [-2,-1] // Moves in negative direction
    ];
    moves.forEach((move) => {
        currentFile = file + move[0]; // calucate new file by extract that array value
        currentRank = rankNumber + move[1]; // same for rank
        if (currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank <= 8) { // Ensure moves stay inside the board because knight may escape
            // files range from 0 - 7 (a to h), rank ranges from 1 to 8

            // Convert currentFile back into letter using String.fromCharCode(currentFile + 97), then add current rank which is the new rank position where the knight is dropped
            let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank; 
            let currentSquare = document.getElementById(currentSquareId);
            let squareContent = isSquareOccupied(currentSquare);
            if (squareContent != "blank" && squareContent == pieceColor)
                // if square is occupied by same color piece, invaild move
                // BUT, if square is empty or occupied by opponent, it is vaild. Hence push it in legal moves
                return; 
                legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank);
        }

    });
}

function getRookMoves(startingSquareId, pieceColor) {
    moveToEighthRank(startingSquareId, pieceColor);
    moveToFirstRank(startingSquareId, pieceColor);
    moveToAFile(startingSquareId, pieceColor);
    moveToHFile(startingSquareId, pieceColor);
};
function moveToEighthRank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0); // Extract the file (column)
    const rank = startingSquareId.charAt(1); // Extract the rank (row)
    let currentRank = parseInt(rank); // Convert rank to a number

    while (currentRank < 8) { // Continue until reaching the 8th rank
        currentRank++; // Move one rank up
        let currentSquareId = file + currentRank; // Combine file and rank to get the square ID
        let currentSquare = document.getElementById(currentSquareId); // Get the square element
        let squareContent = isSquareOccupied(currentSquare); // Check if the square is occupied

        if (squareContent != "blank" && squareContent == pieceColor) {
            return; // Stop if the square is occupied by a piece of the same color
        }

        legalSquares.push(currentSquareId); // Add the square to the list of legal moves

        if (squareContent != "blank" && squareContent != pieceColor) {
            return; // Stop if the square is occupied by an opponent's piece (capture)
        }
    }
}
function moveToFirstRank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0); // Extract the file (column)
    const rank = startingSquareId.charAt(1); // Extract the rank (row)
    let currentRank = parseInt(rank); // Convert rank to a number

    while (currentRank > 1) { // Continue until reaching the 1st rank
        currentRank--; // Move one rank down
        let currentSquareId = file + currentRank; // Combine file and rank to get the square ID
        let currentSquare = document.getElementById(currentSquareId); // Get the square element
        let squareContent = isSquareOccupied(currentSquare); // Check if the square is occupied

        if (squareContent != "blank" && squareContent == pieceColor) {
            return; // Stop if the square is occupied by a piece of the same color
        }

        legalSquares.push(currentSquareId); // Add the square to the list of legal moves

        if (squareContent != "blank" && squareContent != pieceColor) {
            return; // Stop if the square is occupied by an opponent's piece (capture)
        }
    }
}
function moveToARank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0); // Extract the file (column)
    const rank = startingSquareId.charAt(1); // Extract the rank (row)
    let currentFile = file; // Initialize the current file

    while (currentFile > "a") { // Continue until reaching the "a" file
        currentFile = String.fromCharCode(currentFile.charCodeAt(0) - 1); // Move one file to the left
        let currentSquareId = currentFile + rank; // Combine file and rank to get the square ID
        let currentSquare = document.getElementById(currentSquareId); // Get the square element
        let squareContent = isSquareOccupied(currentSquare); // Check if the square is occupied

        if (squareContent != "blank" && squareContent == pieceColor) {
            return; // Stop if the square is occupied by a piece of the same color
        }

        legalSquares.push(currentSquareId); // Add the square to the list of legal moves

        if (squareContent != "blank" && squareContent != pieceColor) {
            return; // Stop if the square is occupied by an opponent's piece (capture)
        }
    }
}
function moveToHRank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0); // Extract the file (column)
    const rank = startingSquareId.charAt(1); // Extract the rank (row)
    let currentFile = file; // Initialize the current file

    while (currentFile < "h") { // Continue until reaching the "h" file
        currentFile = String.fromCharCode(currentFile.charCodeAt(0) + 1); // Move one file to the right
        let currentSquareId = currentFile + rank; // Combine file and rank to get the square ID
        let currentSquare = document.getElementById(currentSquareId); // Get the square element
        let squareContent = isSquareOccupied(currentSquare); // Check if the square is occupied

        if (squareContent != "blank" && squareContent == pieceColor) {
            return; // Stop if the square is occupied by a piece of the same color
        }

        legalSquares.push(currentSquareId); // Add the square to the list of legal moves

        if (squareContent != "blank" && squareContent != pieceColor) {
            return; // Stop if the square is occupied by an opponent's piece (capture)
        }
    }
}