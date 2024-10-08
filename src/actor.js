class Actor {
  constructor(pos, anim, tags='', dat={}, hb=new V(0, 0)) {
    this.id = newid();
    this.tags = tags.split(' ');

    this.dat = dat;

    this.pos = pos;
    this.vel = new V(0, 0);

    this.hitbox = new Hitbox(new V(hb.x, hb.y), this);

    this.anim = {
      l: [],
      pf: 0,
      get current() {
        return this.l[this.f].current
      },
      get f() {
        return this.pf;
      },
      set f(x) {
        var y = this.pf != x;
        this.pf = x;
        if (y)
          this.l[this.pf].resetTime();
      }
    };

    anim.forEach(a => {
      this.anim.l.push(new Animation(...a));
    });

    world.actors[this.id] = this;
  }

  draw() {
    mkdraw(this.pos.y, () => {
      __.img(this.anim.current, [this.pos.x, this.pos.y, SQSIZE, SQSIZE])
    })
  }

  serialize() {
    return [
      { x: this.pos.x, y: this.pos.y },
      this.anim.l.map(l => [l.x, l.p.length, l.s]),
      this.tags,
      this.dat,
      this.hitbox.h,
    ];
  }
}

class Hitbox {
  constructor(h, rel) {
    this.h = h;
    this.rel = rel;
  }

  corners() {

  }

  draw() {
    mkdraw(this.rel.pos.y - 1, () => {
      __.rect(this.b.x, this.b.y, this.o.x, this.o.y, "red")
    });
  }

  get a() {
    return new V(h).add(this.rel.pos).add(0, SQSIZE)
  }

  get b() {
    return new V(h).mul(-1).add(this.rel.pos).add(0, SQSIZE)
  }

  get o() {
    return new V(h).mul(2)
  }
}