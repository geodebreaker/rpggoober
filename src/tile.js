class Tile {
  constructor(pos, dat) {
    this.pos = pos;
    this.dat = dat;

    this.ref = tileset[dat.type];
  }
}