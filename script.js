const Gameboard = (function() {
    let board = ["","","","","","","","",""]

    const getBoard = () => board;

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return {
        getBoard,
        reset
    };
})();

function createUser(name, marker) {
    return {
        name,
        marker
    };
};

const GameController = (function() {
    const player1 = createUser("player1", "X");
    const player2 = createUser("player2", "O");
    const board = Gameboard.getBoard();
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log( `${currentPlayer.name}'s turn`)
    };

    const checkWinner = () => {
        const winningCombos = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for (let combo of winningCombos) {
            const [a, b, c] = combo
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                Gameboard.reset();
                console.log(`${currentPlayer.name} win the game!`);
                return true;
            }
        }
        return false;
    }

    const checkDraw = () => {
        const isBoardFull = board.every(cell => cell !== "");
        if (isBoardFull) {
            Gameboard.reset();
            console.log("Draw");
            return true;
        }
        return false;
    }

    const playRound = (index) => {
        if (board[index] === "") {
            board[index] = currentPlayer.marker
            displayController.updateBoard();

            if (checkWinner() || checkDraw()) {
                Gameboard.reset();
                return;
            }
            switchPlayer();

        } else {
            return null;
        }
    };
    
    return {
        playRound
    }
})();

const displayController = (function(){
    const updateBoard = () => {
        const board = Gameboard.getBoard();
        console.log(board)
    }
    
    return {
        updateBoard
    }
})();