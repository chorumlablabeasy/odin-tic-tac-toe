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
    let player1;
    let player2;
    const board = Gameboard.getBoard();
    let currentPlayer;

    const getCurrentPlayer = () => currentPlayer;

    const init = (name1, name2) => {
        player1 = createUser(name1, "X");
        player2 = createUser(name2, "O");
        currentPlayer = player1;
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log( `${currentPlayer.name}'s turn`);
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
                displayController.showEndMessage(`${currentPlayer.name} wins!`);
                Gameboard.reset();
                console.log(`${currentPlayer.name} wins!`);
                return true;
            }
        }
        return false;
    }

    const checkDraw = () => {
        const isBoardFull = board.every(cell => cell !== "");
        if (isBoardFull) {
            displayController.showEndMessage("It's a draw!");
            Gameboard.reset();
            console.log("It's a draw!");
            return true;
        }
        return false;
    }

    const playRound = (index) => {
        if (board[index] === "") {
            board[index] = currentPlayer.marker;
            displayController.updateBoard();
            
            if (checkWinner() || checkDraw()) {
                Gameboard.reset();
                return;
            }

            switchPlayer();
            displayController.updateInfo();

        } else {
            return null;
        }
    };

    return {
        playRound,
        init,
        getCurrentPlayer
    }
})();

const displayController = (function(){

    const box = document.querySelector("#box");
    const turnInfo = document.querySelector("#turn-indicator")
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        const rawName1 = document.querySelector("#player1").value.trim();
        const rawName2 = document.querySelector("#player2").value.trim();
    
        const name1 = rawName1 === "" ? "Player 1" : rawName1;
        const name2 = rawName2 === "" ? "Player 2" : rawName2;

        GameController.init(name1, name2);
        updateInfo();
        renderCells();
    });
    
    const updateBoard = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll(".cell");
        console.log(board);

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    }
    
    const renderCells = () => {
        box.innerHTML = ""

        for (let i = 0; Gameboard.getBoard().length > i; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute('data-index', i);

            cell.addEventListener("click", () => GameController.playRound(i));

            box.appendChild(cell);
            turnInfo.classList.remove("game-over");
        }
    }

    const updateInfo = () => {
        turnInfo.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    }

    const showEndMessage = (message) => {
        turnInfo.textContent = message;
        turnInfo.classList.add("game-over");
    }

    return {
        updateBoard,
        renderCells,
        updateInfo,
        showEndMessage
    }
})();