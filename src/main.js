var plr;
var cam;

function start() {
  initTileset({
    0: [],
    1: ['grass.png'],
    2: ['bush.png'],
  });
  initWorld();

  plr = new Actor(
    new V(HWSIZE, HWSIZE).sub(0.5).mul(SQSIZE),
    [
      ['plr_idle_l.png', 1, 0.5],
      ['plr_idle_d.png', 1, 0.5],
      ['plr_idle_r.png', 1, 0.5],
      ['plr_idle_u.png', 1, 0.5],
    ],
  );
  plr.anim.f = 1;

  cam = {
    pos: new V(0, 0),
    fixed: true,
  }
}

var center;
function loop() {
  // WIDTH /= 2;
  // HEIGHT /= 2;

  center = new V(WIDTH, HEIGHT).sub(SQSIZE).mul(0.5);

  var d = new V(
    ((input.k.d || input.k.arrowright) ?? 0) - ((input.k.a || input.k.arrowleft) ?? 0),
    ((input.k.s || input.k.arrowdown) ?? 0) - ((input.k.w || input.k.arrowup) ?? 0),
  ).norm().mul(PLRCON.speed);

  if (d.mag > 0) {
    var o = plr.anim.f;
    plr.anim.f = Math.floor((d.head - 45) / 90) + 2;
    if (o != plr.anim.f) {
      plr.anim.l[plr.anim.f].resetTime();
    }
  }

  plr.vel.add(d).mul(PLRCON.drag);
  plr.pos.add(plr.vel);

  if (cam.fixed)
    cam.pos = new V(plr.pos);
  if (cam.pos.x > (WSIZE - 1) * SQSIZE - center.x)
    cam.pos.x = (WSIZE - 1) * SQSIZE - center.x;
  if (cam.pos.y > (WSIZE - 1) * SQSIZE - center.y)
    cam.pos.y = (WSIZE - 1) * SQSIZE  - center.y;
  if (cam.pos.x < center.x)
    cam.pos.x = center.x;
  if (cam.pos.y < center.y)
    cam.pos.y = center.y;

  mkdraw(plr.pos.y, () => {
    var i = plr.anim.current;
    __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  });

  // mkdraw(Infinity, () => {
  //   var i = plr.anim.current;
  //   __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  // });

  var h = Math.ceil(HEIGHT / SQSIZE) + 1;
  var w = Math.ceil(WIDTH / SQSIZE) + 1;
  for (var z = 0; z < 2; z++) {
    for (var i = 0; i < w; i++) {
      for (var j = 0; j < h; j++) {
        var camp = new V(cam.pos).sub(center).div(SQSIZE);
        camp.x = Math.floor(camp.x);
        camp.y = Math.floor(camp.y);
        camp.add(i, j);

        var c = world.tiles[z][camp.x];
        if (c == undefined)
          continue;
        c = c[camp.y];
        if (c == undefined)
          continue;

        var p = camp.mul(SQSIZE);
        mkdraw(
          z == 1 ? p.y : -Infinity,
          (c, px, py) => {
            __.img(c.ref.tex, [px, py, SQSIZE, SQSIZE]);
          }, c, p.x, p.y
        );
      }
    }
  }

  draw();
}

var todraw = [];
mkdraw = (z, cb, ...d) => todraw.push({ z, cb, d });

function draw() {
  _.save();
  _.rect(0, 0, WIDTH, HEIGHT);
  _.clip();
  _.translate(-cam.pos.x, -cam.pos.y);
  _.translate(center.x, center.y);
  todraw.sort((a, b) => a.z - b.z);
  todraw.forEach(x => x.cb(...x.d));
  todraw = [];
  _.restore();
}

ge.start();