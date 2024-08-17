class animation {
  constructor(path, count, speed) {
    this.p = [];
    this.f = 0;
    this.s = speed;
    this.t = 0;

    for (var i = 0; i < count; i++) {
      var x = new Image();
      x.src = 'static/' + i + '_' + path;
      this.p.push(x);
    }
  }

  resetTime(){
    this.t = 0;
  }

  update(dt){
    this.t += dt;
    this.f = Math.floor(this.t * this.s) % this.p.length;
  }

  get current(){
    return this.p[this.f];
  }
}