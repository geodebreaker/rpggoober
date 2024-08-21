var editor = {
  state: 'panel',
  mouse: new V(0, 0),
  mousedown: false,
  brush: 'block',
  newbrush: '',
  pos: new V(0, 0),
  keydown: false,
};

function editorLoop() {
  if (input.k.e && !editor.keydown)
    editor.state = editor.state == 'panel' ? 'off' : 'panel';
  editor.keydown = input.k.e;

  if (editor.state == 'off')
    return;

  if (editor.state == 'panel') {
    WIDTH -= EDWIDTH;
  }

  var center = new V(WIDTH, HEIGHT).sub(SQSIZE).mul(0.5);
  editor.mouse = new V(
    Math.floor((input.m.x + cam.pos.x - center.x) / SQSIZE),
    Math.floor((input.m.y + cam.pos.y - center.y) / SQSIZE)
  );

  mkdraw(
    Infinity,
    (p) => {
      if (tileset[editor.brush].hide === false)
        __.img(tileset[editor.brush].tex, p, undefined, 0.5);
      __.img(ge.getpic('select'), p);
    }, [editor.mouse.x * SQSIZE, editor.mouse.y * SQSIZE, SQSIZE, SQSIZE]
  );


  var t = world.tiles[1][editor.mouse.x];
  if (t != undefined && input.m.x <= WIDTH) {
    t = t[editor.mouse.y];
    if (t != undefined) {

      if (input.m.l) {
        if (!editor.mousedown)
          editor.newbrush = t.type == editor.brush ? 0 : editor.brush;
        if (t.type != editor.newbrush) {
          t.type = editor.newbrush;
          t.update();
        }
      }

      if (input.m.m) {
        editor.brush = t.type;
      }

    }
  }

  editor.mousedown = input.m.l;
}

function eddraw() {
  var i = 0;
  var sp = false;
  for (var n in tileset) {
    if (tileset[n].hide)
      continue;

    var p = new V(i % EDHCNT, Math.floor(i / EDHCNT)).mul(SQSIZE);
    __.img(tileset[n].tex, [p.x, p.y, SQSIZE, SQSIZE]);

    var w = WIDTH + 4;
    if(
      input.m.l && 
      input.m.x > p.x + w && 
      input.m.x < p.x + w + SQSIZE && 
      input.m.y > p.y && 
      input.m.y < p.y + SQSIZE)
      editor.brush = n;

    if(n == editor.brush)
      sp = p;
    
    i++;
  }
  if(sp)
    __.img(ge.getpic('select'), [sp.x, sp.y, SQSIZE, SQSIZE])
}