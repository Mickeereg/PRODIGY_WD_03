document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('mode');
    const difficulty = urlParams.get('difficulty');

    const boardCells = document.querySelectorAll('.board__cell');
    const restartBtn = document.querySelector('.game-restart-btn');
    const backBtn = document.querySelector('.back-btn');
    const popup = document.querySelector('.popup');
    const popupRestartBtn = document.querySelector('.popup__restart-btn');
    const messageEl = document.getElementById('message');
    const scoreXEl = document.getElementById('scoreX');
    const scoreOEl = document.getElementById('scoreO');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let scoreX = 0;
    let scoreO = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellPlayed = (cell, index) => {
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    const checkWin = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) {
            messageEl.innerText = `Player ${currentPlayer} has won!`;
            popup.classList.add('show');
            gameActive = false;
            updateScore(currentPlayer);
            handleWinStyles(currentPlayer);
            return true;
        }
        const roundDraw = !board.includes('');
        if (roundDraw) {
            messageEl.innerText = 'Game ended in a draw!';
            popup.classList.add('show');
            gameActive = false;
            return true;
        }
        return false;
    };

    const handleCellClick = (event) => {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(cell, cellIndex);
        if (!checkWin()) {
            if (gameMode === 'user-vs-user') {
                handlePlayerChange();
            } else if (gameMode === 'user-vs-cpu' && currentPlayer === 'X') {
                handlePlayerChange();
                setTimeout(cpuMove, 500);
            }
        }
    };

    const cpuMove = () => {
        let emptyCells = [];
        boardCells.forEach((cell, index) => {
            if (board[index] === '') {
                emptyCells.push(index);
            }
        });

        let move;
        if (difficulty === 'easy') {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        } else if (difficulty === 'medium') {
            move = findBestMove(board, 'O');
            if (move === -1) {
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        } else {
            move = findBestMove(board, 'O');
        }

        if (move !== -1) {
            handleCellPlayed(boardCells[move], move);
            if (!checkWin()) {
                handlePlayerChange();
            }
        }
    };

    const findBestMove = (board, player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let score = minimax(board, 0, false, player, opponent);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const minimax = (board, depth, isMaximizing, player, opponent) => {
        let scores = {
            [player]: 1,
            [opponent]: -1,
            'tie': 0
        };

        let result = checkWinner(board);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = player;
                    let score = minimax(board, depth + 1, false, player, opponent);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = opponent;
                    let score = minimax(board, depth + 1, true, player, opponent);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinner = (board) => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes('')) {
            return 'tie';
        }
        return null;
    };

    const updateScore = (winner) => {
        if (winner === 'X') {
            scoreX++;
            scoreXEl.innerText = scoreX;
        } else if (winner === 'O') {
            scoreO++;
            scoreOEl.innerText = scoreO;
        }
    };

    const handleWinStyles = (winner) => {
        if (winner === 'X') {
            boardCells.forEach(cell => {
                cell.style.backgroundColor = 'green';
            });
        } else if (winner === 'O') {
            boardCells.forEach(cell => {
                cell.style.backgroundColor = 'red';
            });
        }
    };

    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        boardCells.forEach(cell => {
            cell.innerText = '';
            cell.style.backgroundColor = '';
        });
        popup.classList.remove('show');
    };

    const handleBack = () => {
        window.location.href = 'index.html';
    };

    boardCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', handleRestartGame);
    popupRestartBtn.addEventListener('click', handleRestartGame);
    backBtn.addEventListener('click', handleBack);
});
