const SPEED = 0.0175; // max computer speed

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }

  // AI that controls paddle
  update(delta, ballHeight) {
    // this.position = ballHeight is invincible
    this.position += SPEED * delta * (ballHeight - this.position);
  }
}
