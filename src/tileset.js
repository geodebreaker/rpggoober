class Tileref {
  constructor(id, tex, hide, edpos) {
    this.id = id;
    this.texname = 'tile_' + id;
    if (tex)
      ge.loadpic(tex, this.texname);
    this.hide = hide;
    this.edpos = edpos;
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