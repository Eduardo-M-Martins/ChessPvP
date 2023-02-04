// Get the chess board element and create a div element to show the turn indicator
const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("div");

// Set the text content, color, and alignment for the turn indicator and add it to the body
turnIndicator.textContent = "Current turn: White";
turnIndicator.style.color = 'white';
turnIndicator.style.textAlign = 'center';
document.body.appendChild(turnIndicator);

// Initialize the variables for the current player, history, and selected piece
let currentPlayer = "white";
let history = [];
let selectedPiece = null;

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
            else if (j === 4) board[i][j] = new Piece("white", "\u2655", "queen"); // White queen
            else if (j === 3) board[i][j] = new Piece("white", "\u2654", "king"); // White king
        } else board[i][j] = new Piece("", "", "");
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
    // Get the row and column of the clicked cell
    const row = event.target.parentNode.rowIndex;
    const col = event.target.cellIndex;

    if (board[row][col].color === currentPlayer) {
        selectedPiece = { row, col };
    } else {
        if (!selectedPiece) return;
        const targetPiece = { row, col };
        movePiece(selectedPiece, targetPiece);
        selectedPiece = null;
        updateBoard(board);
    }
}

function movePiece(selectedPiece, targetPiece) {
    const [fromRow, fromCol] = [selectedPiece.row, selectedPiece.col];
    const [toRow, toCol] = [targetPiece.row, targetPiece.col];
    let move = false;

    if (board[fromRow][fromCol].type === "pawn") pawnMove();
    else if (board[fromRow][fromCol].type === "knight") knightMove();
    else if (board[fromRow][fromCol].type === "bishop") bishopMove();
    else if (board[fromRow][fromCol].type === "rook") rookMove();
    else if (board[fromRow][fromCol].type === "queen") queenMove();
    else if (board[fromRow][fromCol].type === "king") kingMove();

    if (move) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = new Piece("", "", "");
        //test();
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        turnIndicator.textContent = `Current turn: ${currentPlayer}`;
    }

    function pawnMove() {
        const direction = currentPlayer === "white" ? -1 : 1;
        // First move
        if ((fromRow + direction * 2 === toRow) && (fromCol === toCol)
            && (fromRow === 1 || fromRow === 6)) {
            if (!board[toRow][toCol].color && !board[toRow - direction][toCol].color)
                move = true;
        }
        // Normal move
        else if ((fromRow + direction === toRow) && (fromCol === toCol)
            && !board[toRow][fromCol].color) {
            move = true;
        }
        // Capture move
        else if ((fromRow + direction === toRow) &&
            (fromCol + 1 === toCol || fromCol - 1 === toCol) && board[toRow][toCol].color !== ""
            && board[toRow][toCol].color !== currentPlayer) {
            move = true;
        }
        // En passant move
        else if ((fromRow === 3 || fromRow === 4) && (fromCol + 1 === toCol || fromCol - 1 === toCol)
            && board[fromRow][toCol].type === "pawn" && board[fromRow][toCol].color !== currentPlayer
            && (fromRow + direction === toRow) && (history[history.length - 2][toRow + direction][toCol].type == "pawn")
            && (history[history.length - 1][toRow + direction][toCol].type == "")) {
            move = true;
            board[fromRow][toCol] = new Piece("", "", "");
        }
    }

    function knightMove() {
        if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
            (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2))
            move = true;
    }

    function bishopMove() {
        // Check if the move is a diagonal move
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return;
        // Check if the path to the target is clear
        let rowStep = (toRow - fromRow) / Math.abs(toRow - fromRow);
        let colStep = (toCol - fromCol) / Math.abs(toCol - fromCol);
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol].type !== "") return;
            currentRow += rowStep;
            currentCol += colStep;
        }
        move = true;
    }

    function rookMove() {
        // Check if the move is vertical or horizontal
        if (fromRow !== toRow && fromCol !== toCol) {
            return;
        }
        // Check if the path to the target is clear
        if (fromRow === toRow) {
            const start = Math.min(fromCol, toCol) + 1;
            const end = Math.max(fromCol, toCol);
            for (let i = start; i < end; i++) {
                if (board[fromRow][i].color !== "") {
                    return;
                }
            }
        } else if (fromCol === toCol) {
            const start = Math.min(fromRow, toRow) + 1;
            const end = Math.max(fromRow, toRow);
            for (let i = start; i < end; i++) {
                if (board[i][fromCol].color !== "") {
                    return;
                }
            }
        }
        move = true;
    }

    function queenMove() {
        rookMove();
        if(move) return;
        bishopMove();
    }

    function kingMove() {

    }
}

function test() {
    for (let k = 0; k < history.length; k++) {
        for (let i = 0; i < 8; i++) {
            console.log(history[k][i][0].unicode + " " + history[k][i][1].unicode + " " + history[k][i][2].unicode + " " + history[k][i][3].unicode + " " + history[k][i][4].unicode + " " + history[k][i][5].unicode + " " + history[k][i][6].unicode + " " + history[k][i][7].unicode);
        }
        console.log(k + "  _____________________________________________________________");
    }
    console.log(history.length + "  =========================================================================================");
}