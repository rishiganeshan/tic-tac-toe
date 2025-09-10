function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    const makeMove = (row,column, player) => {
        // Our board's outermost array represents the row,
        // so we need to loop through the rows, starting at row 0,
        // find all the rows that don't have a token, then take the
        // last one, which will represent the bottom-most empty cell
        // const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.

        // if (!availableCells.length) return;
        if (board[row][column].getValue() !== 0) {
            console.log("That cell is taken!")
            return false;
        }

        // Otherwise, I have a valid cell, the last one in the filtered array
        // const lowestRow = availableCells.length - 1;
        board[row][column].addToken(player);
        return true;
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, makeMove, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

function Cell() {
    let value = 0;

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };


    const playRound = (row, column) => {
        // Drop a token for the current player
        console.log(
            `Adding ${getActivePlayer().name}'s token into (${row},${column})`
        );
        if (!board.makeMove(row, column, getActivePlayer().token)) {
            printNewRound();
            return;

        };


        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
        
        

            
        for (let i=0; i < 3; i++) {
            // console.log(board.getBoard()[i][0].getValue())
            // console.log(board.getBoard()[i][1].getValue())
            // console.log(board.getBoard()[i][2].getValue())

            // console.log(getActivePlayer().token)
            
            if (board.getBoard()[i][0].getValue() ===
                board.getBoard()[i][1].getValue() &&
                board.getBoard()[i][0].getValue() ===
                board.getBoard()[i][2].getValue() &&
                board.getBoard()[i][0].getValue() ===
                getActivePlayer().token) {
                    
                console.log("Winner is player " + 
                    getActivePlayer().token)
                    return;
            }

            if (board.getBoard()[0][i].getValue() ===
                board.getBoard()[1][i].getValue() &&
                board.getBoard()[0][i].getValue() ===
                board.getBoard()[2][i].getValue() &&
                board.getBoard()[0][i].getValue() ===
                getActivePlayer().token) {
                console.log("Winner is player " +
                    getActivePlayer().token)
                return;

            }

        }
        if (board.getBoard()[0][0].getValue() ===
            board.getBoard()[1][1].getValue() &&
            board.getBoard()[0][0].getValue() ===
            board.getBoard()[2][2].getValue() &&
            board.getBoard()[0][0].getValue() ===
            getActivePlayer().token) {
            console.log("Winner is player " +
                getActivePlayer().token)
            return

        }
        if (board.getBoard()[2][0].getValue() ===
            board.getBoard()[1][1].getValue() &&
            board.getBoard()[2][0].getValue() ===
            board.getBoard()[0][2].getValue() &&
            board.getBoard()[2][0].getValue() ===
            getActivePlayer().token) {
            console.log("Winner is player " +
                getActivePlayer().token)
            return

        }
        
        outerLoop:
            for (let i=0; i < 3; i++) {

                for (let j = 0; j < 3; j++) {
                    if (board.getBoard()[i][j].getValue() === 0) {
                        console.log("ok")
                        break outerLoop;
                    }

                }
                if (i===2) {
                    console.log("It's a tie!")
                    return;
                }
            }



        
        

        // Switch player turn
        
        switchPlayerTurn();
        printNewRound();
    };

    const simulateGamePlayer1Win = () => {
        playRound(0, 0)
        playRound(1, 1)
        playRound(0, 1)
        playRound(2, 2)
        playRound(0, 2)

    }

    // const simulateGameTie = () => {
    //     playRound(0, 0)
    //     playRound(1, 1)
    //     playRound(2, 2)
    //     playRound(0, 2)
    //     playRound(2, 0)
    //     playRound(0, 1)
    //     playRound(1, 2)
    //     playRound(1, 0)
    //     playRound(2, 1)

    // }

    // Initial play game message
    printNewRound();
   


    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
        playRound,
        getActivePlayer,
        simulateGamePlayer1Win,
        getBoard: board.getBoard
        // simulateGameTie
    };
}

// const game = GameController();


    

function ScreenController() {

    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const rowDivs = document.querySelectorAll('.row');
    // console.log(rowDivs)

    const updateScreen = () => {
        // clear the board
        
        // boardDiv.textContent = "";
        for (let i = 0; i < 3; i++) {
            rowDivs[i].textContent = "";
        }

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        board.forEach((row,rowIndex) => {
            
            row.forEach((cell, colIndex) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = colIndex
                cellButton.dataset.row = rowIndex
                console.log(cellButton.dataset.column)
                console.log(cellButton.dataset.row)
                console.log("ok")
                cellButton.textContent = cell.getValue();
                rowDivs[rowIndex].appendChild(cellButton);
            })
        })
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();