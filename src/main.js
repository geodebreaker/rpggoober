var FPS = 30;

var SQSIZE = 50;
var WSIZE = 10;
var HWSIZE = WSIZE / 2;

var plr = {
  pos: new V(100, 100),
  vel: new V(0, 0),
  anim: {
    l: [
      new animation('plr_idle_l.png', 1, 0.5),
      new animation('plr_idle_d.png', 1, 0.5),
      new animation('plr_idle_r.png', 1, 0.5),
      new animation('plr_idle_u.png', 1, 0.5),
    ],
    f: 1,
  },
  con: {
    speed: 3,
    drag: 0.7,
  }
};

var cam = {
  pos: new V(0, 0),
  fixed: true,
}

function start() {
  ge.loadpic('cobble.jpg', 'cobble')
}

function loop() {
  var d = new V(
    ((input.k.d || input.k.arrowright) ?? 0) - ((input.k.a || input.k.arrowleft) ?? 0),
    ((input.k.w || input.k.arrowdown) ?? 0) - ((input.k.s || input.k.arrowup) ?? 0),
  ).norm().mul(plr.con.speed);

  if (d.mag > 0) {
    var o = plr.anim.f;
    plr.anim.f = Math.floor((d.head - 45) / 90) + 2;
    if (o != plr.anim.f) {
      plr.anim.l[plr.anim.f].resetTime();
    }
  }

  plr.vel.add(d).mul(plr.con.drag);
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
    var i = plr.anim.l[plr.anim.f].current;
    __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  });

  var img = ge.getpic('cobble');
  var h = Math.ceil(HEIGHT/SQSIZE)+1;
  var w = Math.ceil(WIDTH/SQSIZE)+1;
  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      var p = new V(i, j).mul(SQSIZE).add(cam.pos);
      mkdraw(p.y, () => {
        __.img(img, [p.x, p.y, SQSIZE, SQSIZE]);
      });
    }
  }

  draw();
}

var todraw = [];
mkdraw = (z, cb) => todraw.push({ z, cb });

function draw() {
  _.save();
  _.translate(-cam.pos.x, -cam.pos.y);
  _.translate((WIDTH - SQSIZE) / 2, (HEIGHT - SQSIZE) / 2);
  todraw.sort((a, b) => a.z - b.z);
  todraw.forEach(x => x.cb());
  todraw = [];
  _.restore();
}

ge.start();