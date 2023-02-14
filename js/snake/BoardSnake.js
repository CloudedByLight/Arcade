export default class BoardSnake {
  constructor(boardElem, scoreElem, canvasElem) {
    this.boardElem = boardElem;
    this.scoreElem = scoreElem;
    this.canvasElem = canvasElem;
    this.canvasElem_ctx = canvasElem.getContext("2d");

    // ensures canvas screensize responsiveness
    let canvasMaxHeight = this.canvasElem.parentNode.offsetHeight;
    let canvasMaxWidth = this.canvasElem.parentNode.offsetWidth;
    let canvasSideSize;
    if (canvasMaxHeight >= canvasMaxWidth) {
      canvasSideSize = Math.floor(canvasMaxWidth / 10) * 10;
    } else {
      canvasSideSize = Math.floor(canvasMaxHeight / 10) * 10;
    }
    this.canvasElem.style.width = `${canvasSideSize}px`;
    this.canvasElem.style.height = `${canvasSideSize}px`;
    this.canvasElem.width = canvasSideSize;
    this.canvasElem.height = canvasSideSize;

    // snake movement increment relative to canvas size
    this.increment = Math.floor(canvasSideSize / 40 / 10) * 10;
    this.increment =
      this.increment === 0
        ? Math.floor(canvasSideSize / 20 / 10) * 10
        : this.increment;

    // styles canvas
    this.clear_board();

    // sets score to 0
    this.score = 0;
    this.scoreElem.innerText = this.score;

    // this.snake's X and Y velocity
    this.dx = this.increment;
    this.dy = 0;

    // Food coordinates
    this.food_x;
    this.food_y;

    // snake starts in the middle of the board
    let startingXY =
      Math.floor(
        (Math.floor(canvasSideSize / this.increment) * this.increment) / 2 / 10
      ) * 10;

    this.snake = [
      { x: startingXY, y: startingXY },
      { x: startingXY - this.increment, y: startingXY },
      { x: startingXY - 2 * this.increment, y: startingXY },
      { x: startingXY - 3 * this.increment, y: startingXY },
      { x: startingXY - 4 * this.increment, y: startingXY },
    ];

    // True if changing direction
    this.changing_direction = false;

    document.addEventListener("keydown", (evt) => {
      this.change_direction(evt);
    });

    // Start game
    this.main();
    this.gen_food();
  }

  // called repeatedly to run the game
  main() {
    if (this.has_game_ended()) {
      showGameResult(`Game over`);
      return;
    }
    this.changing_direction = false;
    setTimeout(() => {
      this.clear_board(); // clear board from snake and food drawings
      this.drawFood(); // draw food
      this.move_snake(); // calculate snake xy; if eats, generate new food xy
      this.drawSnake(); // draw snake
      this.main(); // Repeat
    }, 75);
  }

  // clears canvas and styles it
  clear_board() {
    const canvasElem = this.canvasElem;
    const canvasElem_ctx = this.canvasElem_ctx;

    //  Select the colour to fill the drawing
    canvasElem_ctx.fillStyle = "pink";
    //  Select the colour for the border of the canvas
    canvasElem_ctx.strokestyle = "black";
    // Draw a "filled" rectangle to cover the entire canvas
    canvasElem_ctx.fillRect(0, 0, canvasElem.width, canvasElem.height);
    // Draw a "border" around the entire canvas
    canvasElem_ctx.strokeRect(0, 0, canvasElem.width, canvasElem.height);
  }

  // Draw the this.snake on the canvas
  drawSnake() {
    // Draw each part
    this.snake.forEach((snakepart) => {
      this.drawSnakePart(snakepart, this.canvasElem_ctx);
    });
  }

  drawFood() {
    const canvasElem_ctx = this.canvasElem_ctx;

    canvasElem_ctx.fillStyle = "lightgreen";
    canvasElem_ctx.strokestyle = "darkgreen";
    canvasElem_ctx.fillRect(
      this.food_x,
      this.food_y,
      this.increment,
      this.increment
    );
    canvasElem_ctx.strokeRect(
      this.food_x,
      this.food_y,
      this.increment,
      this.increment
    );
  }

  // Draw one this.snake part
  drawSnakePart(snakePart) {
    const canvasElem_ctx = this.canvasElem_ctx;

    // Set the colour of the this.snake part
    canvasElem_ctx.fillStyle = "lightblue";
    // Set the border colour of the this.snake part
    canvasElem_ctx.strokestyle = "darkblue";
    // Draw a "filled" rectangle to represent the this.snake part at the coordinates
    // the part is located
    canvasElem_ctx.fillRect(
      snakePart.x,
      snakePart.y,
      this.increment,
      this.increment
    );
    // Draw a border around the this.snake part
    canvasElem_ctx.strokeRect(
      snakePart.x,
      snakePart.y,
      this.increment,
      this.increment
    );
  }

  has_game_ended() {
    const canvasElem = this.canvasElem;

    // this.snake hit itself
    for (let i = 4; i < this.snake.length; i++) {
      if (
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y
      ) {
        return true;
      }
    }
    // wall hit
    const hitLeftWall = this.snake[0].x < 0;
    const hitRightWall = this.snake[0].x > canvasElem.width - this.increment;
    const hitToptWall = this.snake[0].y < 0;
    const hitBottomWall = this.snake[0].y > canvasElem.height - this.increment;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
  }

  gen_food() {
    const canvasElem = this.canvasElem;

    // Generate a random number the food x-coordinate
    this.food_x = random_food(
      0,
      canvasElem.width - this.increment,
      this.increment
    );
    // Generate a random number for the food y-coordinate
    this.food_y = random_food(
      0,
      canvasElem.height - this.increment,
      this.increment
    );

    // if the new food location is where the this.snake currently is, generate a new food location
    this.snake.forEach((part) => {
      const has_eaten = part.x == this.food_x && part.y == this.food_y;
      if (has_eaten) this.gen_food();
    });
  }

  change_direction(evt) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent the this.snake from reversing
    if (this.changing_direction) return;
    this.changing_direction = true;
    const keyPressed = evt.keyCode;
    const goingUp = this.dy === -this.increment;
    const goingDown = this.dy === this.increment;
    const goingRight = this.dx === this.increment;
    const goingLeft = this.dx === -this.increment;

    if (keyPressed === LEFT_KEY && !goingRight) {
      this.dx = -this.increment;
      this.dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      this.dx = 0;
      this.dy = -this.increment;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      this.dx = this.increment;
      this.dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      this.dx = 0;
      this.dy = this.increment;
    }
  }

  move_snake() {
    // Create the new Snake's head
    const head = {
      x: Math.round(this.snake[0].x + this.dx),
      y: Math.round(this.snake[0].y + this.dy),
    };
    // Add the new head to the beginning of this.snake body
    this.snake.unshift(head);
    const has_eaten_food =
      this.snake[0].x === this.food_x && this.snake[0].y === this.food_y;
    if (has_eaten_food) {
      // Increase score
      this.score += 10;
      // Display score on screen
      this.scoreElem.innerText = this.score;
      // Generate new food location
      this.gen_food();
    } else {
      // Remove the last part of this.snake body
      this.snake.pop();
    }
  }
}

function random_food(min, max, increment) {
  return (
    Math.round((Math.random() * (max - min) + min) / increment) * increment
  );
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
