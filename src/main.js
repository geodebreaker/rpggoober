var plr;
var cam;

function start() {
  ge.loadpic('select.png', 'select');

  initTileset({
    '': ['', true],
    'trigger': ['trigger.png', true],
    'grass': ['grass.png', false],
    'block': ['block.png', false],
    4: ['grass_l.png', false],
    5: ['grass_r.png', false],
    6: ['grass_u.png', false],
    7: ['grass_d.png', false],
    8: ['grass_lu.png', false],
    9: ['grass_rd.png', false],
    10: ['grass_ur.png', false],
    11: ['grass_dl.png', false],
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
  plr.ctrl = true;

  cam = {
    pos: new V(0, 0),
    fixed: true,
  }
}

var center;
function loop() {
  editorLoop();

  center = new V(WIDTH, HEIGHT).sub(SQSIZE).mul(0.5);

  var d = new V(
    ((input.k.d || input.k.arrowright) ?? 0) - ((input.k.a || input.k.arrowleft) ?? 0),
    ((input.k.s || input.k.arrowdown) ?? 0) - ((input.k.w || input.k.arrowup) ?? 0),
  ).norm().mul(PLRCON.speed * (1 / PLRCON.drag) * plr.ctrl);

  if (d.mag > 0) {
    var o = plr.anim.f;
    plr.anim.f = Math.floor((d.head - 45) / 90) + 2;
    if (o != plr.anim.f) {
      plr.anim.l[plr.anim.f].resetTime();
    }
  }

  plr.vel.add(d).mul(PLRCON.drag);
  plr.pos.add(plr.vel);

  plrtrigger().forEach(x => mkdraw(Infinity, x => {
    __.img(ge.getpic('select'),
      [x[1] * SQSIZE, x[2] * SQSIZE, SQSIZE, SQSIZE])
  }, x))

  if (cam.fixed)
    cam.pos = new V(plr.pos);
  if (cam.pos.x > (WSIZE - 1) * SQSIZE - center.x)
    cam.pos.x = (WSIZE - 1) * SQSIZE - center.x;
  if (cam.pos.y > (WSIZE - 1) * SQSIZE - center.y)
    cam.pos.y = (WSIZE - 1) * SQSIZE - center.y;
  if (cam.pos.x < center.x)
    cam.pos.x = center.x;
  if (cam.pos.y < center.y)
    cam.pos.y = center.y;

  mkdraw(plr.pos.y, () => {
    var i = plr.anim.current;
    __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  });

  var h = Math.ceil(HEIGHT / SQSIZE) + 1;
  var w = Math.ceil(WIDTH / SQSIZE) + 1;
  for (var z = 0; z < world.tiles.length; z++) {
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
        if (c == undefined || c.ref.hide)
          continue;

        var p = camp.mul(SQSIZE);
        mkdraw(
          z == 2 ? p.y : z == 3 ? Infinity : -Infinity,
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

  if (editor.state != 'off') {
    _.save();
    _.rect(WIDTH, 0, EDWIDTH, HEIGHT);
    _.clip();
    _.translate(WIDTH + EDMARGIN, EDMARGIN);
    eddraw();
    _.restore();
  }
}

ge.start();

function plrtrigger() {
  var p = new V(plr.pos).div(SQSIZE);
  var pf = new V(Math.floor(p.x), Math.floor(p.y));
  var pc = new V(Math.ceil(p.x), Math.ceil(p.y));
  var pa = new V(pf.x, pc.y);
  var pb = new V(pc.x, pf.y);
  p = [pf, pc, pa, pb];
  var t = [];
  for (var k = 0; k < world.tiles.length; k++) {
    for (var i = 0; i < 4; i++) {
      var x = world.tiles[k][p[i].x];
      if (x == undefined)
        continue;
      x = x[p[i].y];
      if (x == undefined)
        continue;
      if (x.type == 'trigger')
        t.push([k, p[i].x, p[i].y])
    }
  }
  return t;
}