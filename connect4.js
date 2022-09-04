/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
*/
class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.players = [p1, p2];
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
    this.currPlayer = p1;
  }


  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
  */

  makeBoard() {
    // set "board" to empty this.height x this.width matrix array 
    this.board = [...Array(this.height)].map(e => Array(this.width).fill());
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    // get div HTML with id of 'game'
    let gameBoard = document.getElementById("game");

    // create "htmlBoard" HTML element variable w/ID of "board"
    // let htmlBoard = document.getElementById("board");
    let htmlBoard = document.createElement("table");
    htmlBoard.setAttribute("id", "board");

    // create the top row used to select which colument to drop a current piece in and set event listener for click
    let top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    // create the top row for gameboard in html and append
    for (let x = 0; x < this.width; x++) {
      let headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // create
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
    gameBoard.append(htmlBoard);
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === undefined) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    // make a div and insert into correct table cell
    let piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    let cell = document.getElementById(`${y}-${x}`);
    cell.appendChild(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    // append ending game message and outcome underneath game board and a restart button to replay game
    let gameOutcome = document.getElementById("gameoutcome");
    let endgameMessage = document.createElement("h1");
    let restartBtn = document.createElement("button");
    let restartBtnDiv = document.getElementById("restartbtndiv");
    endgameMessage.innerText = msg;
    endgameMessage.setAttribute("id", "endgamemessage");
    restartBtn.innerText = "Restart Game";
    restartBtn.setAttribute("id", "restartbtn");
    restartBtn.addEventListener("click", () => {
      this.makeBoard();
      this.clearGameBoard();
      let p1 = new Player(document.getElementById('p1Color').value, 1);
      let p2 = new Player(document.getElementById('p2Color').value, 2);
      new Game(p1, p2);
    });
    restartBtnDiv.append(restartBtn);
    gameOutcome.append(endgameMessage);

    let top = document.getElementById("column-top");
    top.removeEventListener("click", this.handleClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    //check for gameOver to prevent adding to board after game is complete
    if (this.gameOver === true) {
      return;
    }

    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.placeInTable(y, x);
    this.board[y][x] = this.currPlayer;

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.num} won!`);
    }

    // check for tie, check if all cells in board are filled; if so call endGame
    let result = this.board.every(row => row.every(cell => cell));
    if (result === true) {
      this.gameOver = true;
      return this.endGame('The Game Was A Tie!');
    }

    // switch players, switch currPlayer 1 <-> 2
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );


    // 2 nested for loops to iterate through the whole board, based on this.height and this.width of board
    // sets each potential win condition array for 4 in a row (horizontal, vertical, diagonal 2 different directions)
    // then based on each win condition we run the _win() function to check if any do match
    // in the function we run an every method on the passed in array and if each entry matches the current player (returns true) the current players has won
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  clearGameBoard() {
    let htmlTable = document.getElementById("board");
    let gameOutcome = document.getElementById("endgamemessage");
    let restartBtn = document.getElementById("restartbtn");
    gameOutcome.remove();
    restartBtn.remove();
    htmlTable.remove();
    this.gameOver = false;
  }

}

class Player {
  constructor(color, num) {
    this.color = color;
    this.num = num;
  }
}

document.getElementById('startbtn').addEventListener('click', function () {
    let p1 = new Player(document.getElementById('p1Color').value, 1);
    let p2 = new Player(document.getElementById('p2Color').value, 2);
    new Game(p1, p2);
    let startBtn = document.getElementById("startbtn");
    startBtn.remove();
});

