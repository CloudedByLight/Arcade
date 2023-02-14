import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

export default class BoardPong {
  constructor(
    boardElem,
    ballElem,
    playerPaddleElem,
    computerPaddleElem,
    playerScoreElem,
    computerScoreElem
  ) {
    this.boardElem = boardElem;
    this.ball = new Ball(ballElem);
    this.playerPaddle = new Paddle(playerPaddleElem);
    this.computerPaddle = new Paddle(computerPaddleElem);
    this.playerScoreElem = playerScoreElem;
    this.computerScoreElem = computerScoreElem;
    this.lastTime = null;

    // registers board's height and distance from window's top edge
    let boardComputedHeight = this.boardElem.offsetHeight;
    let boardElemRectY = boardElem.getBoundingClientRect().top;

    // mousemove listener
    boardElem.addEventListener("mousemove", (e) => {
      // paddle position depends on cursor position on the board
      this.playerPaddle.paddleElem.style.setProperty(
        "--position",
        ((e.y - boardElemRectY) / boardComputedHeight) * 100
      );
    });

    // browser calls update() function before creating next frame
    // callback method natively passed the time since program started as arg
    // arrow function needed to for "this" keyword to inherit value from current object
    window.requestAnimationFrame((time) => {
      this.update(time);
    });
  }

  // time arg is the time that has passed since program start
  update(time) {
    // if not the first time update() is called
    if (this.lastTime !== null) {
      const delta = time - this.lastTime; // delta is the time that passes between each frame
      this.ball.update(delta, [
        this.playerPaddle.rect(),
        this.computerPaddle.rect(),
      ]);
      this.computerPaddle.update(delta, this.ball.y);

      // if round ended
      if (this.isLose()) {
        // handle loss and check if all rounds ended
        if (this.handleLose()) {
          return; // all rounds ended
        }
      }
    }

    this.lastTime = time;

    // recursive call to update()
    window.requestAnimationFrame((time) => {
      this.update(time);
    });
  }

  isLose() {
    const rect = this.ball.rect();
    const rectContainer = this.ball.rectContainer();
    return rect.right >= rectContainer.right || rect.left <= rectContainer.left;
  }

  // Updates scores ; if all rounds ended, returns true ; else resets for next round
  handleLose() {
    const rect = this.ball.rect();
    const rectContainer = this.ball.rectContainer();
    if (rect.right >= rectContainer.right) {
      this.playerScoreElem.innerText =
        parseInt(this.playerScoreElem.innerText) + 1;
    } else {
      this.computerScoreElem.innerText =
        parseInt(this.computerScoreElem.innerText) + 1;
    }

    if (this.computerScoreElem.innerText === "3") {
      clearBoardListeners(this.boardElem);
      showGameResult("You lose.");
      return true;
    } else if (this.playerScoreElem.innerText === "3") {
      clearBoardListeners(this.boardElem);
      showGameResult("You win!");
      return true;
    } else {
      this.ball.reset();
      this.computerPaddle.reset();
    }
  }
}
// creates .game-result in .game-container and animates toggler
function showGameResult(resultString) {
  let gameResult = document.createElement("div");
  gameResult.className = "game-result";
  const launchContainers = document.getElementsByClassName("launch-container");
  if (launchContainers.length > 0) {
    launchContainers[0].appendChild(gameResult);
    gameResult.innerText = resultString;
    let closeTogglers = document.getElementsByClassName("close-toggler");
    closeTogglers[0].style.color = "cyan";
    closeTogglers[0].style.animation = "flasher 1s infinite";
  } else {
    console.log("Game forcibly terminated.");
  }
}

// clears listeners from board element by cloning & replacing it
function clearBoardListeners(boardElem) {
  const evtlessBoardElem = boardElem.cloneNode(false);
  boardElem.parentNode.replaceChild(evtlessBoardElem, boardElem);
}
