// Get the chess board element and create a div element to show the turn indicator
const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("h4");

// Set the text content, color, and alignment for the turn indicator and add it to the body
turnIndicator.textContent = "Current turn: White";
turnIndicator.style.color = 'white';
turnIndicator.style.textAlign = 'center';
document.body.appendChild(turnIndicator);

// Initialize the variables for the current player, history, and selected piece
let currentPlayer = "white";
let history = [];
let selectedPiece = null;

// Initialize the variables for the casteling control
let wBigCasteling = true;
let wSmallCasteling = true;
let bBigCasteling = true;
let bSmallCasteling = true;

// Define the Piece class
class Piece {
    constructor(color, unicode, type) {
        this.color = color;
        this.unicode = unicode;
        this.type = type;
    }
}

// Initialize the board with pieces and empty squares
let board = [];
for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
        if (i === 1) board[i][j] = new Piece("black", "\u265F", "pawn"); // Black pawn
        else if (i === 6) board[i][j] = new Piece("white", "\u2659", "pawn"); // White pawn
        else if (i < 2) {
            if (j === 0 || j === 7) board[i][j] = new Piece("black", "\u265C", "rook"); // Black rook
            else if (j === 1 || j === 6) board[i][j] = new Piece("black", "\u265E", "knight"); // Black knight
            else if (j === 2 || j === 5) board[i][j] = new Piece("black", "\u265D", "bishop"); // Black bishop
            else if (j === 3) board[i][j] = new Piece("black", "\u265B", "queen"); // Black queen
            else if (j === 4) board[i][j] = new Piece("black", "\u265A", "king"); // Black king
        } else if (i > 5) {
            if (j === 0 || j === 7) board[i][j] = new Piece("white", "\u2656", "rook"); // White rook
            else if (j === 1 || j === 6) board[i][j] = new Piece("white", "\u2658", "knight"); // White knight
            else if (j === 2 || j === 5) board[i][j] = new Piece("white", "\u2657", "bishop"); // White bishop
            else if (j === 3) board[i][j] = new Piece("white", "\u2655", "queen"); // White queen
            else if (j === 4) board[i][j] = new Piece("white", "\u2654", "king"); // White king
        } else board[i][j] = new Piece("", "  ", "");
    }
}
updateBoard(board);

// Function to update the board
function updateBoard(board) {
    let currentBoard = [];
    for (let i = 0; i < 8; i++) {
        currentBoard[i] = [];
        for (let j = 0; j < 8; j++) {
            currentBoard[i][j] = board[i][j];
        }
    }
    history.push(currentBoard);

    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    for (let i = 0; i < 8; i++) {
        const row = chessBoard.insertRow(); // Create a new row
        for (let j = 0; j < 8; j++) {
            const cell = row.insertCell(); // Create a new cell
            cell.className = (i + j) % 2 === 0 ? "white" : "black";
            cell.addEventListener("click", handleClick); // Add a click event listener
            cell.textContent = history[history.length - 1][i][j].unicode;
        }
    }
}

// Handle the click event
function handleClick(event) {
    // Get the row and column of the clicked cell and change the color of pieces
    const row = event.target.parentNode.rowIndex;
    const col = event.target.cellIndex;
    for (let i = 0; i < document.getElementsByTagName("td").length; i++) {
        document.getElementsByTagName("td")[i].classList.remove("piece-selected");
    }

    if (board[row][col].color === currentPlayer) {
        selectedPiece = { row, col };
        event.target.classList.add("piece-selected");
    } else {
        if (!selectedPiece) return;
        const targetPiece = { row, col };
        movePiece(selectedPiece, targetPiece);
        selectedPiece = null;
        updateBoard(board);
    }
}

function movePiece(selectedPiece, targetPiece) {
    const [fRow, fCol] = [selectedPiece.row, selectedPiece.col];
    const [tRow, tCol] = [targetPiece.row, targetPiece.col];
    let move = false;

    if (board[fRow][fCol].type === "pawn") move = pawnMove(fRow, fCol, tRow, tCol, currentPlayer);
    else if (board[fRow][fCol].type === "knight") move = knightMove(fRow, fCol, tRow, tCol);
    else if (board[fRow][fCol].type === "bishop") move = bishopMove(fRow, fCol, tRow, tCol);
    else if (board[fRow][fCol].type === "rook") move = rookMove(fRow, fCol, tRow, tCol, false);
    else if (board[fRow][fCol].type === "queen") move = queenMove(fRow, fCol, tRow, tCol);
    else if (board[fRow][fCol].type === "king") move = kingMove(fRow, fCol, tRow, tCol, true);

    if (move) {
        let currentBoard = [];
        for (let i = 0; i < 8; i++) {
            currentBoard[i] = [];
            for (let j = 0; j < 8; j++) {
                currentBoard[i][j] = board[i][j];
            }
        }
        board[tRow][tCol] = board[fRow][fCol];
        board[fRow][fCol] = new Piece("", "  ", "");
        if (isCheck()) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    board[i][j] = currentBoard[i][j];
                }
            }
        } else {
            pawnToPiece();
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            turnIndicator.textContent = `Current turn: ${currentPlayer}`;
            isDraw();
            isMate();
        }
    }

    function pawnMove(fromRow, fromCol, toRow, toCol, cPlayer) {
        const direction = cPlayer === "white" ? -1 : 1;
        // First move
        if ((fromRow + direction * 2 === toRow) && (fromCol === toCol)
            && (fromRow === 1 || fromRow === 6)) {
            if (!board[toRow][toCol].color && !board[toRow - direction][toCol].color)
                return true;
        }
        // Normal move
        else if ((fromRow + direction === toRow) && (fromCol === toCol)
            && !board[toRow][fromCol].color) {
            return true;
        }
        // Capture move
        else if ((fromRow + direction === toRow) &&
            (fromCol + 1 === toCol || fromCol - 1 === toCol) && board[toRow][toCol].color !== ""
            && board[toRow][toCol].color !== cPlayer) {
            return true;
        }
        // En passant move
        else if ((fromRow === 3 || fromRow === 4) && (fromCol + 1 === toCol || fromCol - 1 === toCol)
            && board[fromRow][toCol].type === "pawn" && board[fromRow][toCol].color !== cPlayer
            && (fromRow + direction === toRow) && (history[history.length - 2][toRow + direction][toCol].type == "pawn")
            && (history[history.length - 1][toRow + direction][toCol].type == "")) {
            board[fromRow][toCol] = new Piece("", "  ", "");
            return true;

        }
        return false;
    }

    function knightMove(fromRow, fromCol, toRow, toCol) {
        if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
            (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2))
            return true;
        return false;
    }

    function bishopMove(fromRow, fromCol, toRow, toCol) {
        // Check if the move is a diagonal move
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
        // Check if the path to the target is clear
        let rowStep = (toRow - fromRow) / Math.abs(toRow - fromRow);
        let colStep = (toCol - fromCol) / Math.abs(toCol - fromCol);
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol].type !== "") return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        return true;
    }

    function rookMove(fromRow, fromCol, toRow, toCol, queen) {
        // Check if the move is vertical or horizontal
        if (fromRow !== toRow && fromCol !== toCol) {
            return false;
        }
        // Check if the path to the target is clear
        if (fromRow === toRow) {
            const start = Math.min(fromCol, toCol) + 1;
            const end = Math.max(fromCol, toCol);
            for (let i = start; i < end; i++) {
                if (board[fromRow][i].color !== "") {
                    return false;
                }
            }
        } else if (fromCol === toCol) {
            const start = Math.min(fromRow, toRow) + 1;
            const end = Math.max(fromRow, toRow);
            for (let i = start; i < end; i++) {
                if (board[i][fromCol].color !== "") {
                    return false;
                }
            }
        }
        if (!queen && currentPlayer === "white") {
            if (wBigCasteling && fromCol === 0) wBigCasteling = false;
            if (wSmallCasteling && fromCol === 7) wSmallCasteling = false;
        } else if (!queen) {
            if (bBigCasteling && fromCol === 0) bBigCasteling = false;
            if (bSmallCasteling && fromCol === 7) bSmallCasteling = false;
        }
        return true;
    }

    function queenMove(fromRow, fromCol, toRow, toCol) {
        if (rookMove(fromRow, fromCol, toRow, toCol, true)) return true;
        return bishopMove(fromRow, fromCol, toRow, toCol);
    }

    function kingMove(fromRow, fromCol, toRow, toCol, testCasteling) {
        // The king can move one square in any direction
        if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
            currentPlayer === "white" ? (wBigCasteling = false, wSmallCasteling = false) : (bBigCasteling = false, bSmallCasteling = false);
            return true;
            // Test if the castle move is possible
        } else if (testCasteling) {
            if (currentPlayer === "white") {
                if (wBigCasteling && toRow == 7 && toCol == 2 && board[7][1].color === "" && board[7][2].color === "" && board[7][3].color === "")
                    castleMove("white", "big");
                else if (wSmallCasteling && toRow == 7 && toCol == 6 && board[7][5].color === "" && board[7][6].color === "")
                    castleMove("white", "small");
            } else if (bBigCasteling && toRow == 0 && toCol == 2 && board[0][1].color === "" && board[0][2].color === "" && board[0][3].color === "")
                castleMove("black", "big");
            else if (bSmallCasteling && toRow == 0 && toCol == 6 && board[0][5].color === "" && board[0][6].color === "")
                castleMove("black", "small");
        }
        return false;
    }

    function castleMove(color, bigOrSmall) {
        let otherPlayer = currentPlayer === "white" ? "black" : "white";
        let row = color === "white" ? 7 : 0;
        let king = color === "white" ? "\u2654" : "\u265A";
        let rook = color === "white" ? "\u2656" : "\u265C";
        let spaces = bigOrSmall === "big" ? [2, 3, 4] : [4, 5, 6];
        for (let space of spaces) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (board[i][j].color !== currentPlayer) {
                        if (board[i][j].type === "pawn") { if (pawnMove(i, j, row, space, otherPlayer)) return; }
                        else if (board[i][j].type === "knight") { if (knightMove(i, j, row, space)) return; }
                        else if (board[i][j].type === "bishop") { if (bishopMove(i, j, row, space)) return; }
                        else if (board[i][j].type === "rook") { if (rookMove(i, j, row, space, false)) return; }
                        else if (board[i][j].type === "queen") { if (queenMove(i, j, row, space)) return; }
                        else if (board[i][j].type === "king") { if (kingMove(i, j, row, space, false)) return; }
                    }
                }
            }
        }
        board[row][4] = new Piece("", "  ", "");
        if (bigOrSmall === "big") {
            board[row][0] = new Piece("", "  ", "");
            board[row][2] = new Piece(color, king, "king");
            board[row][3] = new Piece(color, rook, "rook");
        } else {
            board[row][7] = new Piece("", "  ", "");
            board[row][6] = new Piece(color, king, "king");
            board[row][5] = new Piece(color, rook, "rook");
        }
        if (color === "white") {
            wBigCasteling = false;
            wSmallCasteling = false;
        } else {
            bBigCasteling = false;
            bSmallCasteling = false;
        }
    }

    function isCheck() {
        let kingRow;
        let kingCol;
        // Find the location of the king of the current player
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].type === "king" && board[i][j].color === currentPlayer) {
                    kingRow = i;
                    kingCol = j;
                    break;
                }
            }
        }
        // Check if any opponent piece can attack the king's location
        otherPlayer = currentPlayer === "white" ? "black" : "white";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].color !== currentPlayer) {
                    if (board[i][j].type === "pawn") { if (pawnMove(i, j, kingRow, kingCol, otherPlayer)) return true; }
                    else if (board[i][j].type === "knight") { if (knightMove(i, j, kingRow, kingCol)) return true; }
                    else if (board[i][j].type === "bishop") { if (bishopMove(i, j, kingRow, kingCol)) return true; }
                    else if (board[i][j].type === "rook") { if (rookMove(i, j, kingRow, kingCol, false)) return true; }
                    else if (board[i][j].type === "queen") { if (queenMove(i, j, kingRow, kingCol)) return true; }
                    else if (board[i][j].type === "king") { if (kingMove(i, j, kingRow, kingCol, false)) return true; }
                }
            }
        }
        return false;
    }

    function pawnToPiece() {
        for (let i = 0; i < 8; i++) {
            if (board[0][i].type === "pawn") openModal();
            if (board[7][i].type === "pawn") openModal();
        }
    }
}

function isDraw() {

}

function isMate() {

}

const modal = document.querySelector('.modal-container')
function openModal() {
    modal.classList.add('active')
}

function pawnToRook() {
    for (let i = 0; i < 8; i++) {
        if (board[0][i].type === "pawn") {
            board[0][i] = new Piece("white", "\u2656", "rook");
        }
        if (board[7][i].type === "pawn") {
            board[7][i] = new Piece("black", "\u265C", "rook");
        }
    }
    updateBoard(board);
    modal.classList.remove('active')
}

function pawnToKnight() {
    for (let i = 0; i < 8; i++) {
        if (board[0][i].type === "pawn") {
            board[0][i] = new Piece("white", "\u2658", "knight")
        }
        if (board[7][i].type === "pawn") {
            board[7][i] = new Piece("black", "\u265E", "knight");
        }
    }
    updateBoard(board);
    modal.classList.remove('active')
}

function pawnToBishop() {
    for (let i = 0; i < 8; i++) {
        if (board[0][i].type === "pawn") {
            board[0][i] = new Piece("white", "\u2657", "bishop");
        }
        if (board[7][i].type === "pawn") {
            board[7][i] = new Piece("black", "\u265D", "bishop");
        }
    }
    updateBoard(board);
    modal.classList.remove('active')
}

function pawnToQueen() {
    for (let i = 0; i < 8; i++) {
        if (board[0][i].type === "pawn") {
            board[0][i] = new Piece("white", "\u2655", "queen");
        }
        if (board[7][i].type === "pawn") {
            board[7][i] = new Piece("black", "\u265B", "queen");
        }
    }
    updateBoard(board);
    modal.classList.remove('active')
}

// Show the winner screen, expect one parameter that indicate the winner (black, white or drawn)
function gameWinner(winner) {
    let screen = document.createElement("div");
    screen.classList.add("result-screen");
    screen.innerText = "Winner: "+winner;
    document.body.appendChild(screen);
    screen.appendChild(document.createElement("br"));
    let refreshButton = document.createElement("button");
    refreshButton.innerText = "Refresh";
    refreshButton.setAttribute("onClick", "window.location.reload();");
    screen.appendChild(refreshButton);
}