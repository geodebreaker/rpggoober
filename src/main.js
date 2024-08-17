var FPS = 30;

var SQSIZE = 50;

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
  pos: new V(0, 0)
}

function start() {

}

function loop() {
  var d = new V(
    ((input.k.d || input.k.arrowright) ?? 0) - ((input.k.a || input.k.arrowleft) ?? 0),
    ((input.k.w || input.k.arrowdown) ?? 0) - ((input.k.s || input.k.arrowup) ?? 0),
  ).norm().mul(plr.con.speed);

  if(d.mag > 0){
    var o = plr.anim.f;
    plr.anim.f = Math.floor((d.head-45)/90)+2;
    if(o != plr.anim.f){
      plr.anim.l[plr.anim.f].resetTime();
    }
  }

  plr.vel.add(d).mul(plr.con.drag);
  plr.pos.add(plr.vel);

  mkdraw(plr.pos.y, () => {
    var i = plr.anim.l[plr.anim.f].current;
    __.img(i, [plr.pos.x, plr.pos.y, SQSIZE, SQSIZE]);
  })

  draw();
}

var todraw = [];
mkdraw = (z, cb) => todraw.push({ z, cb });

function draw() {
  _.save();
  _.translate(cam.pos.x, cam.pos.y);
  todraw.sort((a, b) => b.z - a.z);
  todraw.forEach(x => x.cb());
  todraw = [];
  _.restore();
}

ge.start();