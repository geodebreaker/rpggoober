class Actor {
  constructor(pos, anim){
    this.id = newid();

    this.pos = pos;
    this.vel = new V(0, 0);

    this.anim = {
      l: [],
      f: 0,
      get current(){
        return this.l[this.f].current
      }
    };

    anim.forEach(a => {
      this.anim.l.push(new Animation(...a));
    });

    world.actors[this.id] = this;
  }
}