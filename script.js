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

    const start = (player1Name, player2Name) => {
        players = [
            Player(player1Name, 'X'),
            Player(player2Name, 'O')
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

const DisplayController = (() => {
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            if (board[index] === 'X') {
                cell.innerHTML = '<i class="fas fa-times"></i>';
            } else if (board[index] === 'O') {
                cell.innerHTML = '<i class="far fa-circle"></i>';
            } else {
                cell.innerHTML = '';
            }
        });
    };

    const updateMessage = (message) => {
        document.getElementById('message').textContent = message;
    };

    const init = () => {
        const gameContainer = document.getElementById('game-container');
        const playerSetup = document.getElementById('player-setup');
        const startButton = document.getElementById('start-btn');
        const restartButton = document.getElementById('restart-btn');
        const gameboard = document.getElementById('gameboard');

        startButton.addEventListener('click', () => {
            const player1Name = document.getElementById('player1-name').value || 'Player X';
            const player2Name = document.getElementById('player2-name').value || 'Player O';
            
            GameController.start(player1Name, player2Name);
            renderBoard();
            updateMessage(`Game started! ${player1Name}'s turn`);
            
            playerSetup.classList.add('hidden');
            gameContainer.classList.remove('hidden');
        });

        gameboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !GameController.isGameOver()) {
                const index = parseInt(e.target.getAttribute('data-index'));
                const result = GameController.playTurn(index);
                renderBoard();
                updateMessage(result);
            }
        });

        restartButton.addEventListener('click', () => {
            playerSetup.classList.remove('hidden');
            gameContainer.classList.add('hidden');
            document.getElementById('player1-name').value = '';
            document.getElementById('player2-name').value = '';
        });
    };

    return { init };
})();

DisplayController.init();