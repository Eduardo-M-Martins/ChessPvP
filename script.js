// Get the chess board element and create a div element to show the turn indicator
const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("h4");
const modal = document.querySelector('.modal-container')

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
let wBigCastle = true;
let wSmallCastle = true;
let bBigCastle = true;
let bSmallCastle = true;

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
    }
}

function movePiece(selectedPiece, targetPiece) {
    const [fromRow, fromCol] = [selectedPiece.row, selectedPiece.col];
    const [toRow, toCol] = [targetPiece.row, targetPiece.col];
    let move = false;

    if (board[fromRow][fromCol].type === "pawn") move = pawnMove(board, fromRow, fromCol, toRow, toCol, currentPlayer, true);
    else if (board[fromRow][fromCol].type === "knight") move = knightMove(board, fromRow, fromCol, toRow, toCol, true);
    else if (board[fromRow][fromCol].type === "bishop") move = bishopMove(board, fromRow, fromCol, toRow, toCol, true);
    else if (board[fromRow][fromCol].type === "rook") move = rookMove(board, fromRow, fromCol, toRow, toCol, false, true);
    else if (board[fromRow][fromCol].type === "queen") move = queenMove(board, fromRow, fromCol, toRow, toCol, true);
    else if (board[fromRow][fromCol].type === "king") move = kingMove(board, fromRow, fromCol, toRow, toCol, true, true);

    // If the movement is valid, do it
    if (move) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = new Piece("", "  ", "");
        pawnToPiece();
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        turnIndicator.textContent = `Current turn: ${currentPlayer}`;
        updateBoard(board);
        isTheEnd();
    }

    function pawnMove(thisBoard, fRow, fCol, tRow, tCol, player, testCheck) {
        const direction = player === "white" ? -1 : 1;
        // First move
        if ((fRow + direction * 2 === tRow) && (fCol === tCol)
            && (fRow === 1 || fRow === 6)) {
            if (!thisBoard[tRow][tCol].color && !thisBoard[tRow - direction][tCol].color)
                if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
        }
        // Normal move
        else if ((fRow + direction === tRow) && (fCol === tCol)
            && !thisBoard[tRow][fCol].color) {
            if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
        }
        // Capture move
        else if ((fRow + direction === tRow) &&
            (fCol + 1 === tCol || fCol - 1 === tCol) && thisBoard[tRow][tCol].color !== ""
            && thisBoard[tRow][tCol].color !== player) {
            if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
        }
        // En passant move
        else if ((fRow === 3 || fRow === 4) && (fCol + 1 === tCol || fCol - 1 === tCol)
            && thisBoard[fRow][tCol].type === "pawn" && thisBoard[fRow][tCol].color !== player
            && (fRow + direction === tRow) && (history[history.length - 2][tRow + direction][tCol].type == "pawn")
            && (history[history.length - 1][tRow + direction][tCol].type == "")) {
            thisBoard[fRow][tCol] = new Piece("", "  ", "");
            if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;

        }
        return false;
    }

    function knightMove(thisBoard, fRow, fCol, tRow, tCol, testCheck) {
        if ((Math.abs(fRow - tRow) === 2 && Math.abs(fCol - tCol) === 1) ||
            (Math.abs(fRow - tRow) === 1 && Math.abs(fCol - tCol) === 2))
            if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
        return false;
    }

    function bishopMove(thisBoard, fRow, fCol, tRow, tCol, testCheck) {
        // Check if the move is a diagonal move
        if (Math.abs(fRow - tRow) !== Math.abs(fCol - tCol)) return false;
        // Check if the path to the target is clear
        let rowStep = (tRow - fRow) / Math.abs(tRow - fRow);
        let colStep = (tCol - fCol) / Math.abs(tCol - fCol);
        let row = fRow + rowStep;
        let col = fCol + colStep;
        while (row !== tRow || col !== tCol) {
            if (thisBoard[row][col].type !== "") return false;
            row += rowStep;
            col += colStep;
        }
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
    }

    function rookMove(thisBoard, fRow, fCol, tRow, tCol, isQueen, testCheck) {
        // Check if the move is vertical or horizontal
        if (fRow !== tRow && fCol !== tCol) {
            return false;
        }
        // Check if the path to the target is clear
        if (fRow === tRow) {
            const start = Math.min(fCol, tCol) + 1;
            const end = Math.max(fCol, tCol);
            for (let i = start; i < end; i++) {
                if (thisBoard[fRow][i].color !== "") {
                    return false;
                }
            }
        } else if (fCol === tCol) {
            const start = Math.min(fRow, tRow) + 1;
            const end = Math.max(fRow, tRow);
            for (let i = start; i < end; i++) {
                if (thisBoard[i][fCol].color !== "") {
                    return false;
                }
            }
        }
        // Disables castling when moving the rook
        if (!isQueen && currentPlayer === "white") {
            if (wBigCastle && fCol === 0) wBigCastle = false;
            if (wSmallCastle && fCol === 7) wSmallCastle = false;
        } else if (!isQueen) {
            if (bBigCastle && fCol === 0) bBigCastle = false;
            if (bSmallCastle && fCol === 7) bSmallCastle = false;
        }
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
    }

    function queenMove(thisBoard, fRow, fCol, tRow, tCol, testCheck) {
        if (rookMove(thisBoard, fRow, fCol, tRow, tCol, true, testCheck)) return true;
        return bishopMove(thisBoard, fRow, fCol, tRow, tCol, testCheck);
    }

    function kingMove(thisBoard, fRow, fCol, tRow, tCol, testCasteling, testCheck) {
        // The king can move one square in any direction
        if (Math.abs(fRow - tRow) <= 1 && Math.abs(fCol - tCol) <= 1) {
            currentPlayer === "white" ? (wBigCastle = false, wSmallCastle = false) : (bBigCastle = false, bSmallCastle = false);
            if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol); else return true;
            // Test if the castling move is possible
        } else if (testCasteling) {
            if (currentPlayer === "white") {
                if (wBigCastle && tRow == 7 && tCol == 2 && thisBoard[7][1].color === "" && thisBoard[7][2].color === "" && thisBoard[7][3].color === "")
                    castleMove("white", "big");
                else if (wSmallCastle && tRow == 7 && tCol == 6 && thisBoard[7][5].color === "" && thisBoard[7][6].color === "")
                    castleMove("white", "small");
            } else if (bBigCastle && tRow == 0 && tCol == 2 && thisBoard[0][1].color === "" && thisBoard[0][2].color === "" && thisBoard[0][3].color === "")
                castleMove("black", "big");
            else if (bSmallCastle && tRow == 0 && tCol == 6 && thisBoard[0][5].color === "" && thisBoard[0][6].color === "")
                castleMove("black", "small");
        }
        return false;
    }

    function castleMove(color, side) {
        let otherPlayer = currentPlayer === "white" ? "black" : "white";
        let row = color === "white" ? 7 : 0;
        let king = color === "white" ? "\u2654" : "\u265A";
        let rook = color === "white" ? "\u2656" : "\u265C";
        let columns = side === "big" ? [2, 3, 4] : [4, 5, 6];
        for (let col of columns) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (board[i][j].color !== currentPlayer) {
                        if (board[i][j].type === "pawn") { if (pawnMove(board, i, j, row, col, otherPlayer, false)) return; }
                        else if (board[i][j].type === "knight") { if (knightMove(board, i, j, row, col, false)) return; }
                        else if (board[i][j].type === "bishop") { if (bishopMove(board, i, j, row, col, false)) return; }
                        else if (board[i][j].type === "rook") { if (rookMove(board, i, j, row, col, false, false)) return; }
                        else if (board[i][j].type === "queen") { if (queenMove(board, i, j, row, col, false)) return; }
                        else if (board[i][j].type === "king") { if (kingMove(board, i, j, row, col, false, false)) return; }
                    }
                }
            }
        }
        board[row][4] = new Piece("", "  ", "");
        if (side === "big") {
            board[row][0] = new Piece("", "  ", "");
            board[row][2] = new Piece(color, king, "king");
            board[row][3] = new Piece(color, rook, "rook");
        } else {
            board[row][7] = new Piece("", "  ", "");
            board[row][6] = new Piece(color, king, "king");
            board[row][5] = new Piece(color, rook, "rook");
        }
        if (color === "white") {
            wBigCastle = false;
            wSmallCastle = false;
        } else {
            bBigCastle = false;
            bSmallCastle = false;
        }
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        turnIndicator.textContent = `Current turn: ${currentPlayer}`;
        updateBoard(board);
        isTheEnd();
    }

    function isCheck(board, fRow, fCol, tRow, tCol) {
        let thisBoard = [];
        for (let i = 0; i < 8; i++) {
            thisBoard[i] = [];
            for (let j = 0; j < 8; j++) {
                thisBoard[i][j] = board[i][j];
            }
        }
        let kRow;
        let kCol;
        thisBoard[tRow][tCol] = thisBoard[fRow][fCol];
        thisBoard[fRow][fCol] = new Piece("", "  ", "");
        // Find the location of the king of the current player
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (thisBoard[i][j].type === "king" && thisBoard[i][j].color === currentPlayer) {
                    kRow = i;
                    kCol = j;
                    break;
                }
            }
        }
        // Check if any opponent piece can attack the king's location
        otherPlayer = currentPlayer === "white" ? "black" : "white";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (thisBoard[i][j].color !== currentPlayer) {
                    if (thisBoard[i][j].type === "pawn") { if (pawnMove(thisBoard, i, j, kRow, kCol, otherPlayer, false)) return true; }
                    else if (thisBoard[i][j].type === "knight") { if (knightMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                    else if (thisBoard[i][j].type === "bishop") { if (bishopMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                    else if (thisBoard[i][j].type === "rook") { if (rookMove(thisBoard, i, j, kRow, kCol, false, false)) return true; }
                    else if (thisBoard[i][j].type === "queen") { if (queenMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                    else if (thisBoard[i][j].type === "king") { if (kingMove(thisBoard, i, j, kRow, kCol, false, false)) return true; }
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

    function isTheEnd() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].color === currentPlayer) {
                    for (let k = 0; k < 8; k++) {
                        for (let l = 0; l < 8; l++) {
                            if (board[k][l].color !== currentPlayer) {
                                if (board[i][j].type === "rook") { if (rookMove(board, i, j, k, l, false, true)) return; }
                                else if (board[i][j].type === "knight") { if (knightMove(board, i, j, k, l, true)) return; }
                                else if (board[i][j].type === "bishop") { if (bishopMove(board, i, j, k, l, true)) return; }
                                else if (board[i][j].type === "queen") { if (queenMove(board, i, j, k, l, true)) return; }
                                else if (board[i][j].type === "king") { if (kingMove(board, i, j, k, l, false, true)) return; }
                                else if (board[i][j].type === "pawn") { if (pawnMove(board, i, j, k, l, currentPlayer, true)) return; }
                            }
                        }
                    }
                }
            }
        }
        if(isCheck(board,0,0,0,0)) mate(); 
        else draw();
    }
}

function mate(){
    console.log("mate");
}

function draw(){
    console.log("draw");
}

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