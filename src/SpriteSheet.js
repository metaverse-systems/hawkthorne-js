class SpriteSheet
{
  constructor(canvas, url, spriteWidth, spriteHeight) {
    this.sheet = new Image();
    this.sheet.src = url;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.context = canvas.getContext("2d");
  }

  /*
   *  spriteX: column in sprite sheet
   *  spriteY: row in sprite sheet
   *  x, y: Canvas coordinates
   *  scale: Shrink or enlarge sprite
   */
  draw = (spriteX, spriteY, x, y, scale) => {
    this.context.drawImage(this.sheet,
      (spriteX * this.spriteWidth) + 1, (spriteY * this.spriteHeight) + 1,
      this.spriteWidth - 2, this.spriteHeight - 1,
      x, y,
      this.spriteWidth * scale, this.spriteHeight * scale
    );
  }
};

export default SpriteSheet;
