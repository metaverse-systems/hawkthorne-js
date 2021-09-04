class SpriteSheet
{
  constructor(canvas, url, spriteWidth, spriteHeight) {
    this.sheet = new Image();
    this.sheet.src = url;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  /*
   *  spriteX: column in sprite sheet
   *  spriteY: row in sprite sheet
   *  x, y: Canvas coordinates
   *  scale: Shrink or enlarge sprite
   */
  draw = (spriteX, spriteY, x, y, options = {}) => {
    if(options.scale === undefined) options.scale = 1;

    let xScale = 1, xTranslate = 0;
    let yScale = 1, yTranslate = 0;
    let newX = x, newY = y;

    if(options.flipHorizontal === true) {
      xScale = -1;
      xTranslate = this.canvas.width;
      newX = this.canvas.width - x - this.spriteWidth;
    }

    if(options.flipVertical === true) {
      yScale = -1;
      yTranslate = this.canvas.height;
      newY = this.canvas.height - y - this.spriteHeight;
    }

    if(options.flipDiagonal) {
      this.context.save();
      this.context.translate(x, y);
      this.context.rotate(270 * (Math.PI / 180));
      this.context.drawImage(this.sheet,
        (spriteX * this.spriteWidth), (spriteY * this.spriteHeight),
        this.spriteWidth, this.spriteHeight,
        -this.spriteWidth, 0,
        this.spriteWidth * options.scale, this.spriteHeight * options.scale
      );
      this.context.restore();
      return;
    }

    if(options.flipVertical || options.flipHorizontal) {
      this.context.save();
      this.context.translate(xTranslate, yTranslate);
      this.context.scale(xScale, yScale);
      this.context.drawImage(this.sheet,
        (spriteX * this.spriteWidth), (spriteY * this.spriteHeight),
        this.spriteWidth, this.spriteHeight,
        newX, newY,
        this.spriteWidth * options.scale, this.spriteHeight * options.scale
      );
      this.context.restore();
    } else {
      this.context.drawImage(this.sheet,
        (spriteX * this.spriteWidth), (spriteY * this.spriteHeight),
        this.spriteWidth, this.spriteHeight,
        x, y,
        this.spriteWidth * options.scale, this.spriteHeight * options.scale
      );
    }
  }
};

export default SpriteSheet;
