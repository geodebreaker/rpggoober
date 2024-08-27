class Tileref {
  constructor(id, tex, hide, col) {
    this.id = id;
    this.texname = 'tile_' + id;
    if (tex)
      ge.loadpic(tex, this.texname);
    this.phide = hide;
    this.texpath = tex;
    this.col = col.split('').map(x=>x=='-');
  }

  get tex() {
    return ge.getpic(this.texname);
  }

  get hide() {
    return this.phide && !(SHOWHIDDEN && !this.id == '');
  }
}

var tileset;
var tilesetuninit;
function initTileset(tiles) {
  tilesetuninit = tiles;
  tileset = {};

  for (var i in tiles) {
    tileset[i] = new Tileref(i, ...tiles[i]);
  }
}