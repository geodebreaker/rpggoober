class Animation {
  constructor(path, count, speed) {
    this.p = [];
    this.f = 0;
    this.s = speed;
    this.t = 0;
    this.x = path;

    for (var i = 0; i < count; i++) {
      ge.loadpic(i + '_' + path, 'anim_' + i + '_' + path);
      this.p.push(ge.getpic('anim_' + i + '_' + path));
    }
  }

  resetTime() {
    this.t = 0;
  }

  update(dt) {
    this.t += dt;
    this.f = Math.floor(this.t * this.s) % this.p.length;
  }

  get current() {
    return this.p[this.f];
  }
}