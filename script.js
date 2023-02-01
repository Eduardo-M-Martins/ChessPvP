// Get the chess board element and the turn indicator element
const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("div");

// Set the text content of the turn indicator to "Current turn: White" and add it to the body
turnIndicator.textContent = "Current turn: White";
document.body.appendChild(turnIndicator);
let currentPlayer = "white";

// Object to store the chess piece symbols for white and black
const pieceSymbols = {
    white: {
        pawn: "\u2659",
        knight: "\u2658",
        bishop: "\u2657",
        rook: "\u2656",
        queen: "\u2655",
        king: "\u2654"
    },
    black: {
        pawn: "\u265F",
        knight: "\u265E",
        bishop: "\u265D",
        rook: "\u265C",
        queen: "\u265B",
        king: "\u265A"
    }
};

// Loop through 8 rows and 8 columns to create the chess board
for (let i = 0; i < 8; i++) {
    const row = chessBoard.insertRow(); // create a new row
    for (let j = 0; j < 8; j++) {
        const cell = row.insertCell(); // create a new cell
        // Add the class "white" or "black" depending on the row and column index
        cell.className = (i + j) % 2 === 0 ? "white" : "black";
        cell.addEventListener("click", handleClick); // add a click event listener
        // Place the starting pieces on the board
        if (i === 1) cell.textContent = pieceSymbols.black.pawn;
        else if (i === 6) cell.textContent = pieceSymbols.white.pawn;
        else if (i < 2) {
            if (j === 0 || j === 7) cell.textContent = pieceSymbols.black.rook;
            else if (j === 1 || j === 6) cell.textContent = pieceSymbols.black.knight;
            else if (j === 2 || j === 5) cell.textContent = pieceSymbols.black.bishop;
            else if (j === 3) cell.textContent = pieceSymbols.black.queen;
            else cell.textContent = pieceSymbols.black.king;
        } else if (i > 5) {
            if (j === 0 || j === 7) cell.textContent = pieceSymbols.white.rook;
            else if (j === 1 || j === 6) cell.textContent = pieceSymbols.white.knight;
            else if (j === 2 || j === 5) cell.textContent = pieceSymbols.white.bishop;
            else if (j === 4) cell.textContent = pieceSymbols.white.queen;
            else cell.textContent = pieceSymbols.white.king;
        }
    }
}
let selectedPiece = null;

// Handle the click event
function handleClick(event) {
    const targetCell = event.target;

    const isCurrentPlayerPiece = targetCell.textContent.includes(pieceSymbols[currentPlayer].pawn) ||
        targetCell.textContent.includes(pieceSymbols[currentPlayer].knight) ||
        targetCell.textContent.includes(pieceSymbols[currentPlayer].bishop) ||
        targetCell.textContent.includes(pieceSymbols[currentPlayer].rook) ||
        targetCell.textContent.includes(pieceSymbols[currentPlayer].queen) ||
        targetCell.textContent.includes(pieceSymbols[currentPlayer].king);

    if (isCurrentPlayerPiece) {
        if (!selectedPiece) {
            selectedPiece = targetCell;
            return;
        }
    } else {
        if (!selectedPiece) return;
        if (movePiece(selectedPiece, targetCell)) {
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            turnIndicator.textContent = `Current turn: ${currentPlayer[0].toUpperCase() + currentPlayer.slice(1)}`;
        }
        selectedPiece = null;
    }
}

function movePiece(selectedPiece, targetPiece) {
    const selectedRow = selectedPiece.parentNode.rowIndex;
    const selectedCol = selectedPiece.cellIndex;
    const targetRow = targetPiece.parentNode.rowIndex;
    const targetCol = targetPiece.cellIndex;

    // check the selected piece
    if (selectedPiece.textContent === pieceSymbols[currentPlayer].knight) {
        return knightMove(selectedRow, selectedCol, targetRow, targetCol);
    } else if (selectedPiece.textContent === pieceSymbols[currentPlayer].pawn) {
        return pawnMove(selectedRow, selectedCol, targetRow, targetCol);
    } else if (selectedPiece.textContent === pieceSymbols[currentPlayer].bishop) {
        return bishopMove(selectedRow, selectedCol, targetRow, targetCol);
    } else if (selectedPiece.textContent === pieceSymbols[currentPlayer].rook) {
        return rookMove(selectedRow, selectedCol, targetRow, targetCol);
    } else if (selectedPiece.textContent === pieceSymbols[currentPlayer].queen) {
        return queenMove(selectedRow, selectedCol, targetRow, targetCol);
    }else if (selectedPiece.textContent === pieceSymbols[currentPlayer].king) {
        return kingMove(selectedRow, selectedCol, targetRow, targetCol);
    }
    return false;

    function knightMove(selectedRow, selectedCol, targetRow, targetCol) {
        // check if the knight is moving to a square that is 2 rows and 1 column away, or 2 columns and 1 row away
        if ((Math.abs(selectedRow - targetRow) === 2 && Math.abs(selectedCol - targetCol) === 1) ||
            (Math.abs(selectedRow - targetRow) === 1 && Math.abs(selectedCol - targetCol) === 2)) {
            targetPiece.textContent = selectedPiece.textContent;
            selectedPiece.textContent = "";
            return true;
        }
    }

    function pawnMove(selectedRow, selectedCol, targetRow, targetCol) {

    }

    function bishopMove(selectedRow, selectedCol, targetRow, targetCol) {

    }

    function rookMove(selectedRow, selectedCol, targetRow, targetCol) {

    }

    function queenMove(selectedRow, selectedCol, targetRow, targetCol) {

    }

    function kingMove(selectedRow, selectedCol, targetRow, targetCol) {

    }
}