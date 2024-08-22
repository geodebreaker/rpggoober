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
          type = 'block_0000';
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
  world.tiles[1][5][5].type = 'trigger';
  world.tiles[1][5][5].dat.hover =
    'mkdraw(Infinity, x=>__.text("interact", x.pos.x*SQSIZE, x.pos.y*SQSIZE, "white", 20, "black", 3), this)';
  world.tiles[1][5][5].dat.interact =
    'plr.pos.x = 1000';
  world.tiles[1][5][5].update();
}

function newid() {
  var x = Math.floor(Math.random() * 0xffffffff).toString(16);
  return x;
}

function drawActors() {
  for (var id in world.actors) {
    world.actors[id].draw();
  }
}

function getActorTag(...tags) {
  var p = [];
  for (var id in world.actors) {
    var a = world.actors[id];
    if (tags.every(t => a.tags.includes(t)))
      p.push(a);
  }
  return p;
}

async function serializeWorld() {
  return await compress(JSON.stringify({
    tiles: world.tiles.map(l => l.map(w => w.map(t => t.dat))),
    actors: Object.keys(world.actors).map(id=>world.actors[id].serialize()),
    tileset: tilesetuninit,
  }));
}