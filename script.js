const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("div");
turnIndicator.textContent = "Current turn: White";
document.body.appendChild(turnIndicator);
let currentPlayer = "white"; // white starts first

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

// create the chess board with starting pieces
for (let i = 0; i < 8; i++) {
    const row = chessBoard.insertRow();
    for (let j = 0; j < 8; j++) {
        const cell = row.insertCell();
        cell.className = (i + j) % 2 === 0 ? "white" : "black";
        cell.addEventListener("click", handleClick);
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

function handleClick(event) {
    if (!event.target.textContent) return;

    if (event.target.textContent.includes(pieceSymbols[currentPlayer].pawn) ||
        event.target.textContent.includes(pieceSymbols[currentPlayer].knight) ||
        event.target.textContent.includes(pieceSymbols[currentPlayer].bishop) ||
        event.target.textContent.includes(pieceSymbols[currentPlayer].rook) ||
        event.target.textContent.includes(pieceSymbols[currentPlayer].queen) ||
        event.target.textContent.includes(pieceSymbols[currentPlayer].king)) {
        if (!selectedPiece) {
            selectedPiece = event.target;
            return;
        }
    } else {
        if (!selectedPiece) return;
        const targetPiece = event.target;
        if (movePiece(selectedPiece, targetPiece)) {
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            turnIndicator.textContent = `Current turn: ${currentPlayer[0].toUpperCase() + currentPlayer.slice(1)}`;
        }
        selectedPiece = null;
    }
}

function movePiece(selectedPiece, targetPiece) {
    // get the row and column of the selected piece and target cell
    const selectedRow = selectedPiece.parentNode.rowIndex;
    const selectedCol = selectedPiece.cellIndex;
    const targetRow = targetPiece.parentNode.rowIndex;
    const targetCol = targetPiece.cellIndex;

    // check if the selected piece is a knight
    if (selectedPiece.textContent === pieceSymbols[currentPlayer].knight) {
        // check if the knight is moving to a square that is 2 rows and 1 column away,
        // or 2 columns and 1 row away
        if ((Math.abs(selectedRow - targetRow) === 2 && Math.abs(selectedCol - targetCol) === 1) ||
            (Math.abs(selectedRow - targetRow) === 1 && Math.abs(selectedCol - targetCol) === 2)) {
            // move the piece if the move is valid
            targetPiece.textContent = selectedPiece.textContent;
            selectedPiece.textContent = "";
            return true;
        }
    } else {
        // code to validate and move other pieces

        // move the piece if the move is valid
        targetPiece.textContent = selectedPiece.textContent;
        selectedPiece.textContent = "";
        return true;
    }
    return false;
}