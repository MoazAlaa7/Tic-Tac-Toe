const GameBoard = (function () {
  let board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];

  const getBoard = () => board;
  const resetBoard = () => {
    board.forEach((row, index) => {
      board[index] = ["-", "-", "-"];
    });
  };
  const printBoard = () => board.forEach((row) => console.log(row));

  return { getBoard, resetBoard, printBoard };
})();

const Player = function (board) {
  this.name = null;
  this.symbol = null;
  this.makeMove = function (row, col) {
    if (board[row][col] === "-") {
      board[row][col] = this.symbol;
      return true;
    }
    return false;
  };
};

const GameController = (function () {
  let board = GameBoard.getBoard();
  let player1 = new Player(board);
  let player2 = new Player(board);

  let activePlayer = player1;

  function startGame(e) {
    const form = e.target;
    player1.name = form["player-1-name"].value || "Player 1";
    player2.name = form["player-2-name"].value || "Player 2";
    player1.symbol = form["player-1-symbol"].value || "X";
    player2.symbol = form["player-2-symbol"].value || "O";

    GameBoard.resetBoard();
    console.log("Game started!");
    console.log(`${player1.name}: ${player1.symbol}`);
    console.log(`${player2.name}: ${player2.symbol}`);
  }

  function playRound(row, col) {
    if (activePlayer.makeMove(row, col)) {
      console.log(
        `${activePlayer.name} placed ${activePlayer.symbol} at row: ${
          row * 1 + 1
        }, Column: ${col * 1 + 1}`
      );
      if (isGameOver().gameover) {
        isGameOver().status === "win"
          ? console.log(`Game Over! ${activePlayer.name} wins!`)
          : console.log(`Game Over! It's a DRAW!`);
        GameBoard.printBoard();
        return;
      }
      switchTurn();
    } else {
      console.log("Invalid move! Try again.");
    }
  }

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    console.log(`${activePlayer.name}'s turn.`);
  };

  const getActivePlayer = () => activePlayer;

  function isGameOver() {
    if (checkWinCondition()) {
      return {
        gameover: true,
        status: "win",
      };
    } else if (checkDrawCondition()) {
      return {
        gameover: true,
        status: "draw",
      };
    } else {
      return {
        gameover: false,
        status: "tbd", // To Be Determined
      };
    }
  }

  function checkWinCondition() {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if (
        (board[i][0] === board[i][1] &&
          board[i][1] === board[i][2] &&
          board[i][2] !== "-") ||
        (board[0][i] === board[1][i] &&
          board[1][i] === board[2][i] &&
          board[2][i] !== "-")
      ) {
        return true;
      }
    }
    // Check diagonals
    if (
      (board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[2][2] !== "-") ||
      (board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[2][0] !== "-")
    ) {
      return true;
    }

    return false;
  }

  function checkDrawCondition() {
    for (const row of board) {
      if (row.includes("-")) return false;
    }
    return true;
  }

  return {
    startGame,
    getActivePlayer,
    playRound,
    isGameOver,
  };
})();

const ScreenController = (function () {
  const turnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const board = GameBoard.getBoard();
  let activePlayer;

  const updateScreen = () => {
    boardDiv.textContent = "";
    activePlayer = GameController.getActivePlayer();

    const isGameOver = GameController.isGameOver();
    if (isGameOver.gameover) {
      isGameOver.status === "win"
        ? (turnDiv.textContent = `Game Over! ${activePlayer.name} WINS!`)
        : (turnDiv.textContent = `Game Over! It's a DRAW!`);
    } else {
      turnDiv.textContent = `${activePlayer.name}'s turn`;
    }

    board.forEach((row, cellRow) => {
      row.forEach((cell, cellCol) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell-btn");
        cellBtn.textContent = cell;
        cellBtn.dataset.row = cellRow;
        cellBtn.dataset.column = cellCol;
        isGameOver.gameover
          ? (cellBtn.disabled = true)
          : (cellBtn.disabled = false);
        boardDiv.appendChild(cellBtn);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedColumn) return;

    GameController.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  const dialog = document.querySelector("dialog");
  const startBtn = document.querySelector(".start-btn");
  startBtn.addEventListener("click", () => {
    dialog.showModal();
  });

  const form = document.querySelector(".player-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    GameController.startGame(e);
    updateScreen();
    dialog.close();
  });

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    dialog.close();
  });
})();
