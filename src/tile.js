class Tile {
  constructor(pos, dat) {
    this.pos = pos;
    this.dat = dat;
    this.type = dat.type;
    this.update();
  }

  update(){
    this.dat.type = this.type;
    this.ref = tileset[this.type];
  }
}