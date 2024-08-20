class Tileref {
  constructor(id, tex) {
    this.id = id;
    this.texname = 'tile_' + id;
    if (tex)
      ge.loadpic(tex, this.texname);
  }

  get tex() {
    return ge.getpic(this.texname);
  }
}

var tileset;
function initTileset(tiles) {
  tileset = {};

  for (var i in tiles) {
    tileset[i] = new Tileref(i, ...tiles[i]);
  }
}