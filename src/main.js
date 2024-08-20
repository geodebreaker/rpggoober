var plr;
var cam;

function start() {
  ge.loadpic('cobble.jpg', 'cobble');
  initTileset({
    0: [],
    1: ['cobble.jpg', 0],
    2: ['brick.jpg', 1],
  });
  initWorld();

  plr = new Actor(
    new V(0, 0),
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
  cam.pos.add(HWSIZE * SQSIZE);
  cam.pos.x = Math.abs(cam.pos.x) > WSIZE * SQSIZE + WIDTH ?
    Math.sign(cam.pos.x) * WSIZE * SQSIZE + WIDTH : cam.pos.x;
  cam.pos.y = Math.abs(cam.pos.y) > WSIZE * SQSIZE + HEIGHT ?
    Math.sign(cam.pos.y) * WSIZE * SQSIZE + HEIGHT : cam.pos.y;
  cam.pos.sub(HWSIZE * SQSIZE);

  mkdraw(plr.pos.y, () => {
    var i = plr.anim.current;
    __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  });

  var h = Math.ceil(HEIGHT / SQSIZE) + 1;
  var w = Math.ceil(WIDTH / SQSIZE) + 1;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      var camp = new V(cam.pos).div(SQSIZE);
      camp.x = Math.floor(camp.x);
      camp.y = Math.floor(camp.y);
      camp.add(i, j);

      var c = world.tiles[camp.x];
      if(c == undefined)
        continue;
      c = c[camp.y];
      if(c == undefined)
        continue;

      var p = camp.mul(SQSIZE).sub(center);
      mkdraw(
        c.ref.layer == 1 ? p.y : -Infinity,
        (c, px, py) => {
          __.img(c.ref.tex, [px, py, SQSIZE, SQSIZE]);
        }, c, p.x, p.y
      );
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