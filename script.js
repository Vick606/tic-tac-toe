const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;

    const makeMove = (index, player) => {
        if (board[index] === null) {
            board[index] = player;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, makeMove, reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            Player('Player X', 'X'),
            Player('Player O', 'O')
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.reset();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWin = (board, marker) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winningCombos.some(combo => 
            combo.every(index => board[index] === marker)
        );
    };

    const checkDraw = (board) => {
        return board.every(cell => cell !== null);
    };

    const playTurn = (index) => {
        if (gameOver) return "Game is over!";

        if (Gameboard.makeMove(index, getCurrentPlayer().marker)) {
            const board = Gameboard.getBoard();
            console.log("Current board state:", board);

            if (checkWin(board, getCurrentPlayer().marker)) {
                gameOver = true;
                return `${getCurrentPlayer().name} wins!`;
            } else if (checkDraw(board)) {
                gameOver = true;
                return "It's a draw!";
            } else {
                switchPlayer();
                return `${getCurrentPlayer().name}'s turn`;
            }
        }
        return "Invalid move!";
    };

    const isGameOver = () => gameOver;

    return { start, playTurn, getCurrentPlayer, isGameOver };
})();

// Game initialization
GameController.start();
