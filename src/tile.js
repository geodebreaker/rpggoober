class Tile {
  constructor(pos, dat) {
    this.pos = pos;
    this.dat = dat;
    this.type = dat.type;
    this.update();
  }

  update() {
    this.dat.type = this.type;
  }

  get ref() {
    return tileset[this.type] == undefined ? tileset[''] : tileset[this.type];
  }
}