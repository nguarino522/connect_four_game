/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
*/


const defaultWidth = 7;
const defaultHeight = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
*/

function makeBoard() {
  // set "board" to empty defaultHeight x defaultWidth matrix array 
  board = [...Array(defaultHeight)].map(e => Array(defaultWidth).fill());
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < defaultWidth; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < defaultHeight; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < defaultWidth; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = defaultHeight - 1; y >= 0; y--) {
    if (board[y][x] === undefined) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  let piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);
  let cell = document.getElementById(`${y}-${x}`);
  cell.appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message with game result
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie, check if all cells in board are filled; if so call endGame
  let result = board.every(row => row.every(cell => cell));
  if (result === true) return endGame('The Game Was A Tie!');

  // switch players, switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < defaultHeight &&
        x >= 0 &&
        x < defaultWidth &&
        board[y][x] === currPlayer
    );
  }

  // 2 nested for loops to iterate through the whole board, based on height and width of board
  // sets each potential win condition array for 4 in a row (horizontal, vertical, diagonal 2 different directions)
  // then based on each win condition we run the _win() function to check if any do match
  // in the function we run an every method on the passed in array and if each entry matches the current player (returns true) the current players has won
  for (let y = 0; y < defaultHeight; y++) {
    for (let x = 0; x < defaultWidth; x++) {
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

makeBoard();
makeHtmlBoard();

