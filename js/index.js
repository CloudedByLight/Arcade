import BoardPong from "./pong/BoardPong.js";
import BoardTTT from "./tictactoe/BoardTTT.js";
import BoardSnake from "./snake/BoardSnake.js";

const menuLines = document.getElementsByClassName("line");

alert(
  `
Hi !
My arcade is meant for PCs only, as games functionality & controls (such as Arrow Keys & MouseMove) are not supported on mobile devices.

- Ralph :)
`
);

for (let i = 0; i < menuLines.length - 1; i++) {
  menuLines[i].addEventListener("click", createLaunchContainer);
}

function createLaunchContainer() {
  // "this" keyword designates the element that triggered event
  // gameChosen determined from "this" data-game html attribute
  let gameChosen = this.dataset.game;

  // sets menuElem and copyrightElem sign to display: none
  const menuElem = document.getElementById("menu");
  const copyrightElem = document.getElementById("copyright");
  menuElem.style.display = "none";
  copyrightElem.style.display = "none";

  // creates section.launch-container and appends it as child of main
  const launchContainerElem = document.createElement("section");
  document.getElementsByTagName("main")[0].style.gap = "0";
  document.getElementsByTagName("main")[0].appendChild(launchContainerElem);
  launchContainerElem.className = "launch-container";

  // creates ion-icon.close-toggler and appends it as child of .launch-container
  const closeTogglerElem = document.createElement("ion-icon");
  closeTogglerElem.className = "close-toggler";
  closeTogglerElem.setAttribute("name", "close-outline");
  launchContainerElem.appendChild(closeTogglerElem);

  // adds click event listener to toggler: close launch-container and display menu
  closeTogglerElem.addEventListener("click", () => {
    document.getElementsByTagName("main")[0].style.gap = "5%";
    launchContainerElem.remove();
    menuElem.style.display = "inline-block";
    copyrightElem.style.display = "inline-block";
  });

  // creates header for launch-container
  const lcHeaderElem = document.createElement("header");
  launchContainerElem.appendChild(lcHeaderElem);
  lcHeaderElem.innerText = gameChosen;

  // creates game container
  const gameContainerElem = document.createElement("div");
  launchContainerElem.appendChild(gameContainerElem);
  gameContainerElem.className = "game-container";

  launchGame(gameChosen, gameContainerElem);
}

function launchGame(gameChosen, gameContainerElem) {
  if (gameChosen === "Pong") {
    launchPong(gameContainerElem);
  } else if (gameChosen === "Tic Tac Toe") {
    launchTTT(gameContainerElem);
  } else {
    launchSnake(gameContainerElem);
  }
}

// PONG
function launchPong(gameContainerElem) {
  // creates gameBoardPong element on DOM
  const gameBoardPongElem = document.createElement("div");
  gameContainerElem.appendChild(gameBoardPongElem);
  gameBoardPongElem.className = "board board--pong";

  /*
  Following code block creates the following html snippet in the DOM:
  
  <div class="scoreboard">
    <div class="score score--player">0</div>
    <div class="score score--cpu">0</div>
  </div>
  <div class="ball"></div>
  <div class="paddle paddle--left"></div>
  <div class="paddle paddle--right"></div>
  */
  const scoreboardElem = document.createElement("div");
  gameBoardPongElem.appendChild(scoreboardElem);
  scoreboardElem.className = "scoreboard";
  const playerScoreElem = document.createElement("div");
  const computerScoreElem = document.createElement("div");
  scoreboardElem.appendChild(playerScoreElem);
  scoreboardElem.appendChild(computerScoreElem);
  playerScoreElem.className = "scoreboard__score score--player";
  computerScoreElem.className = "scoreboard__score score--cpu";
  playerScoreElem.innerText = computerScoreElem.innerText = 0;
  const ballElem = document.createElement("div");
  gameBoardPongElem.appendChild(ballElem);
  ballElem.className = "ball";
  const playerPaddleElem = document.createElement("div");
  gameBoardPongElem.appendChild(playerPaddleElem);
  playerPaddleElem.className = "paddle paddle--left";
  const computerPaddleElem = document.createElement("div");
  gameBoardPongElem.appendChild(computerPaddleElem);
  computerPaddleElem.className = "paddle paddle--right";

  const gameBoardPong = new BoardPong(
    gameBoardPongElem,
    ballElem,
    playerPaddleElem,
    computerPaddleElem,
    playerScoreElem,
    computerScoreElem
  );
}

// TIC TAC TOE
function launchTTT(gameContainerElem) {
  // creates gameBoardTTT element on DOM
  const gameBoardTTTElem = document.createElement("div");
  gameContainerElem.appendChild(gameBoardTTTElem);

  // creates Tic Tac Toe's board object, which holds all game functionality
  const boardTTT = new BoardTTT(gameBoardTTTElem);
}

// SNAKE
function launchSnake(gameContainerElem) {
  // creates gameBoardSnake element on DOM
  const gameBoardSnakeElem = document.createElement("div");
  gameContainerElem.appendChild(gameBoardSnakeElem);
  gameBoardSnakeElem.className = "board board--snake";

  // creates snakeScore element on DOM
  const snakeScoreElem = document.createElement("div");
  gameBoardSnakeElem.appendChild(snakeScoreElem);
  snakeScoreElem.className = "snake__score";

  // creates snakeCanvas element on DOM
  const snakeCanvasElem = document.createElement("canvas");
  gameBoardSnakeElem.appendChild(snakeCanvasElem);
  snakeCanvasElem.className = "snake__canvas";

  // creates Snake board object, which holds all game functionality
  const boardSnake = new BoardSnake(
    gameBoardSnakeElem,
    snakeScoreElem,
    snakeCanvasElem
  );
}
