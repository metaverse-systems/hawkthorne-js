import SpriteSheet from './SpriteSheet';

class SpriteAnimation
{
  constructor(canvas, url, spriteWidth, spriteHeight, characterMap) {
    this.sheet = new SpriteSheet(canvas, url, spriteWidth, spriteHeight);
    this.frame = 0;
    this.animation = "";
    this.direction = "";
    this.repeat = "";
    this.loop = [];
    this.characterMap = characterMap;
  }

  animate = (animation, direction, x, y, scale) => {
    let restart = false;

    if(this.animation !== animation) {
      this.animation = animation;
      restart = true;
    }

    if(this.direction !== direction) {
      this.direction = direction;
      restart = true;
    }

    if(restart) {
      this.frame = 0;
      this.loop = [];

      let charMap = this.characterMap[animation];
      let animations = [];
      if(Array.isArray(charMap)) {
        // No direction
        this.repeat = charMap[0];
        animations = charMap[1];
      } else {
        this.repeat = charMap[direction][0];
        animations = charMap[direction][1];
      }

      animations.forEach((e) => {
        // subtracting 1 because character_map.json uses 1-based indexing

        let [x, y] = e.split(",");
        if(x.search("-") !== -1) {
          // multiple x coords in one entry, split them up
          let [startX, endX] = x.split("-");
          for(let i = startX; i <= endX; i++) {
            this.loop.push({ x: (i - 1), y: (y - 1) });
          }
        } else {
          this.loop.push({ x: (x - 1), y: (y - 1) });
        }
      });
    }

    this.draw(x, y, scale);
  }

  /*
   *  x, y: Canvas coordinates
   *  scale: Shrink or enlarge sprite
   */
  draw = (x, y, scale) => {
    if(this.loop.length === 0) return;

    this.sheet.draw(this.loop[this.frame].x, this.loop[this.frame].y, x, y, scale);
    this.frame++;

    if(this.frame === this.loop.length) this.frame = 0;
  }
};

export default SpriteAnimation;
