var world;
function initWorld() {
  world = {};
  world.actors = {};
  world.tiles = [];

  for (var k = 0; k < 4; k++) {
    var tmp = new Array(WSIZE);
    for (var i = 0; i < WSIZE; i++) {
      var tmp2 = new Array(WSIZE);
      for (var j = 0; j < WSIZE; j++) {

        var type;
        if (k == 0)
          type = 'grass';
        else if (
          k == 1 &&
          (i == 0 || i == WSIZE - 1 || j == 0 || j == WSIZE - 1 || Math.random() < 0.1))
          type = 'block';
        else
          type = '';

        tmp2[j] = new Tile(
          new V(i, j),
          { type }
        );

      }
      tmp[i] = tmp2;
    }
    world.tiles[k] = tmp;
  }
}

function newid() {
  var x = Math.floor(Math.random() * 0xffffffff).toString(16);
  return x;
}