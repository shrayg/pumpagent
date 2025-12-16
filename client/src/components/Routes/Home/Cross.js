export default class Cross {
  constructor(
    canvasWidth,
    canvasHeight,
    sizeVariation = true,
    speedFactor = 1,
    x = null,
    y = null
  ) {
    // Canvas boundaries
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Position
    this.x = x !== null ? x : Math.random() * canvasWidth;
    this.y = y !== null ? y : -50 - Math.random() * 200; // Start above the canvas

    // Size
    this.baseSize = sizeVariation ? 10 + Math.random() * 30 : 20;
    this.size = this.baseSize;

    // Speed and movement
    this.speedFactor = speedFactor;
    this.baseSpeed = 0.05 + Math.random() * 0.1;
    this.speed = this.baseSpeed * this.speedFactor;

    // Appearance
    this.alpha = 0.7 + Math.random() * 0.3;
    this.green = 150 + Math.floor(Math.random() * 105); // 150-255 for different greens

    // Movement patterns
    this.angle = 0;
    this.swingRange = 0.5 + Math.random() * 1.5;
    this.swingSpeed = 0.001 + Math.random() * 0.002;
    this.rotationSpeed = 0.001 * (Math.random() - 0.5);
    this.rotation = Math.random() * Math.PI * 2;

    // Glow effect
    this.glow = 5 + Math.random() * 10;
  }

  update(deltaTime, currentSpeedFactor) {
    // Update speed based on current speed factor
    this.speed = this.baseSpeed * currentSpeedFactor;

    // Update vertical position (falling)
    this.y += this.speed * deltaTime;

    // Add a gentle swinging motion
    this.angle += this.swingSpeed * deltaTime;
    this.x += Math.sin(this.angle) * this.swingRange;

    // Rotate the cross
    this.rotation += this.rotationSpeed * deltaTime;

    // Reset if off-screen
    if (this.y > this.canvasHeight + this.size) {
      this.y = -this.size;
      this.x = Math.random() * this.canvasWidth;
    }

    // Keep within horizontal bounds
    if (this.x < -this.size) this.x = this.canvasWidth + this.size;
    if (this.x > this.canvasWidth + this.size) this.x = -this.size;
  }

  draw(ctx) {
    ctx.save();

    // Translate to position and apply rotation
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Set cross style
    const color = `rgba(0, ${this.green}, 100, ${this.alpha})`;
    ctx.fillStyle = color;

    // Add glow effect
    ctx.shadowColor = `rgba(0, ${this.green}, 100, 0.7)`;
    ctx.shadowBlur = this.glow;

    // Draw the cross (as a plus sign)
    const armWidth = this.size * 0.25;
    const armLength = this.size;

    // Horizontal arm
    ctx.fillRect(-armLength / 2, -armWidth / 2, armLength, armWidth);

    // Vertical arm
    ctx.fillRect(-armWidth / 2, -armLength / 2, armWidth, armLength);

    // Add highlight
    ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
    ctx.fillRect(-armWidth / 3, -armWidth / 3, armWidth / 1.5, armWidth / 1.5);

    ctx.restore();
  }
}
