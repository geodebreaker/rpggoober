var world;
function initWorld() {
  world = {};
  world.actors = {};
  world.tiles = [];

  for (var i = 0; i < WSIZE; i++) {
    var tmp = [];
    for (var j = 0; j < WSIZE; j++) {
      
      var type = i == 0 || i == WSIZE - 1 || j == 0 || j == WSIZE - 1 ? 2 : 1;
      tmp.push(new Tile(
        new V(i, j),
        { type }
      ));

    }
    world.tiles.push(tmp);
  }
}

function newid(){
  var x = Math.floor(Math.random() * 0xffffffff).toString(16);
  return x;
}