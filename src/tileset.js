class Tileref {
  constructor(id, tex, layer) {
    this.id = id;
    this.texname = 'tile_' + id;
    if (tex)
      ge.loadpic(tex, this.texname);
    this.layer = layer;
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