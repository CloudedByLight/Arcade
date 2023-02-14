const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }
  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }
  rectContainer() {
    return this.ballElem.parentNode.getBoundingClientRect();
  }

  reset() {
    // initial position of ball
    this.x = 50;
    this.y = 50;

    // direction is a unit vector
    this.direction = { x: 0 };

    // while the movement of the ball isnt too vertical (boring game)
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.8
    ) {
      // creates a random angle between 0 and 2pi rad
      const heading = randomNumberBetween(0, 2 * Math.PI);
      // gets direction from the angle in terms of x, y coordinates using cos/sin
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();
    const rectContainer = this.rectContainer();

    if (rect.bottom >= rectContainer.bottom || rect.top <= rectContainer.top) {
      this.direction.y *= -1;
      setTimeout(() => {}, 100); // gives it time to bounce back
    }

    // if a paddle is hit by the ball, reverses x direction of ball
    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
      setTimeout(() => {}, 100); // gives it time to bounce back
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(paddleRect, ballRect) {
  return (
    paddleRect.left <= ballRect.right &&
    paddleRect.right >= ballRect.left &&
    paddleRect.top <= ballRect.bottom &&
    paddleRect.bottom >= ballRect.top
  );
}
