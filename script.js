const chessBoard = document.getElementById("chessBoard");
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
        if (i === 1) {
            cell.textContent = pieceSymbols.black.pawn;
        } else if (i === 6) {
            cell.textContent = pieceSymbols.white.pawn;
        } else if (i === 0) {
            if (j === 0 || j === 7) {
                cell.textContent = pieceSymbols.black.rook;
            } else if (j === 1 || j === 6) {
                cell.textContent = pieceSymbols.black.knight;
            } else if (j === 2 || j === 5) {
                cell.textContent = pieceSymbols.black.bishop;
            } else if (j === 3) {
                cell.textContent = pieceSymbols.black.queen;
            } else {
                cell.textContent = pieceSymbols.black.king;
            }
        } else if (i === 7) {
            if (j === 0 || j === 7) {
                cell.textContent = pieceSymbols.white.rook;
            } else if (j === 1 || j === 6) {
                cell.textContent = pieceSymbols.white.knight;
            } else if (j === 2 || j === 5) {
                cell.textContent = pieceSymbols.white.bishop;
            } else if (j === 4) {
                cell.textContent = pieceSymbols.white.queen;
            } else {
                cell.textContent = pieceSymbols.white.king;
            }
        }
        cell.addEventListener("click", handleClick);
    }
}

function handleClick(event) {
    if (!event.target.textContent) {
        return;
    }
    event.target.style.backgroundColor = "lightblue";
    selectedPiece = event.target;
}

function handleMove(event) {
    if (!selectedPiece) {
        return;
    }
    if (event.target.textContent) {
        // can't move to a square with a piece
        return;
    }
    event.target.textContent = selectedPiece.textContent;
    selectedPiece.textContent = "";
    selectedPiece.style.backgroundColor = "";
    selectedPiece = null;
    currentPlayer = currentPlayer === "white" ? "black" : "white";
}

chessBoard.addEventListener("click", handleMove);