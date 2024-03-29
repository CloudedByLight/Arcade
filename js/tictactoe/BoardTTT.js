export default class BoardTTT {
  constructor(boardElem) {
    this.boardElem = boardElem;
    this.boardElem.className = "board board--ttt";
    this.turnFlag = true;
    this.turnCounter = 1;
    this.tiles = []; // to contain 9 tiles elements from the DOM
    /*
    For better security than the current code offers, winning conditions should be
    verified on a seperate tiles array which would contain backend tile marks objs,
    instead of the DOM frontend tile elements like the one above.
    */

    // creates DOM tiles and pushes them to this.tiles
    for (let i = 0; i < 9; i++) {
      let tileElem = document.createElement("div");
      this.boardElem.appendChild(tileElem);
      tileElem.className = "tile tile--" + (i + 1);
      tileElem.addEventListener(
        "click",
        (evt) => {
          this.placeMark(evt);
        },
        { once: true }
      );
      this.tiles.push(tileElem);
    }
  }

  // places mark on tileElem clicked
  placeMark(evt) {
    const boardTTT = this; // board object
    const tileElem = evt.target; // tileElem (html element) clicked

    // fills tileElem with mark html element
    const mark = document.createElement("div");
    tileElem.appendChild(mark);
    tileElem.style.cursor = "auto";

    if (boardTTT.turnFlag === true) {
      mark.className = "o";
      mark.innerText = "O";
    } else {
      mark.className = "x";
      mark.innerText = "X";
    }

    // when min 5 chips placed and board isnt full
    if (boardTTT.turnCounter >= 5 && boardTTT.turnCounter <= 9) {
      boardTTT.tttWinner = boardTTT.boardState(boardTTT); // check for winner
      if (boardTTT.tttWinner !== false) {
        // winner found:
        clearBoardListeners(boardTTT.boardElem);
        showGameResult(`${boardTTT.tttWinner} wins !`);
        return;
      } else if (boardTTT.turnCounter === 9) {
        // board full:
        clearBoardListeners(boardTTT.boardElem);
        showGameResult("Match tie.");
        return;
      }
    }
    // continue game
    boardTTT.turnCounter += 1;
    boardTTT.turnFlag = !boardTTT.turnFlag;
  }

  // validates if game ended by examining DOM
  boardState() {
    let tiles = this.tiles;
    let turnFlag = this.turnFlag;
    let winner = turnFlag === true ? "O" : "X";

    if (
      (tiles[0].innerText === winner &&
        tiles[1].innerText === winner &&
        tiles[2].innerText === winner) ||
      (tiles[0].innerText === winner &&
        tiles[3].innerText === winner &&
        tiles[6].innerText === winner) ||
      (tiles[0].innerText === winner &&
        tiles[4].innerText === winner &&
        tiles[8].innerText === winner) ||
      (tiles[1].innerText === winner &&
        tiles[4].innerText === winner &&
        tiles[7].innerText === winner) ||
      (tiles[2].innerText === winner &&
        tiles[5].innerText === winner &&
        tiles[8].innerText === winner) ||
      (tiles[2].innerText === winner &&
        tiles[4].innerText === winner &&
        tiles[6].innerText === winner) ||
      (tiles[3].innerText === winner &&
        tiles[4].innerText === winner &&
        tiles[5].innerText === winner) ||
      (tiles[6].innerText === winner &&
        tiles[7].innerText === winner &&
        tiles[8].innerText === winner)
    ) {
      return winner; // returns winner name
    }
    return false; // no winner: returns false
  }
}

// creates .game-result in .game-container and animates toggler
function showGameResult(resultString) {
  let gameResult = document.createElement("div");
  gameResult.className = "game-result";
  const launchContainers = document.getElementsByClassName("launch-container");
  launchContainers[0].appendChild(gameResult);
  gameResult.innerText = resultString;

  let closeTogglers = document.getElementsByClassName("close-toggler");
  closeTogglers[0].style.color = "cyan";
  closeTogglers[0].style.animation = "flasher 1s infinite";
}

// clears listeners from board element by cloning & replacing it
function clearBoardListeners(boardElem) {
  const evtlessBoardElem = boardElem.cloneNode(true);
  boardElem.parentNode.replaceChild(evtlessBoardElem, boardElem);
  for (let tileElem of evtlessBoardElem.children) {
    tileElem.style.cursor = "default";
  }
}
