var editor = {
  state: 'panel',
  page: 'pallete',
  mouse: new V(0, 0),
  mousedown: false,
  brush: 'block_0000',
  newbrush: '',
  pos: new V(0, 0),
  keydown: false,
  console: '',
};
var validprop = [
  'trigger',
  'interact',
  'hover'
];

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
          editor.newbrush = t.type == editor.brush ? '' : editor.brush;
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
  if (editor.page == 'pallete')
    eddrawpallete();
  if (editor.page == 'console')
    eddrawconsole();
}

function eddrawpallete() {
  var i = 0;
  var sp = false;
  for (var n in tileset) {
    if (tileset[n].hide)
      continue;

    var p = new V(i % EDHCNT, Math.floor(i / EDHCNT)).mul(SQSIZE);
    __.img(tileset[n].tex, [p.x, p.y, SQSIZE, SQSIZE]);

    var w = WIDTH + 4;
    if (
      input.m.l &&
      input.m.x > p.x + w &&
      input.m.x < p.x + w + SQSIZE &&
      input.m.y > p.y &&
      input.m.y < p.y + SQSIZE)
      editor.brush = n;

    if (n == editor.brush)
      sp = p;

    i++;
  }
  if (sp)
    __.img(ge.getpic('select'), [sp.x, sp.y, SQSIZE, SQSIZE]);
}

function eddrawconsole() {
  edcon()
}

function ederr(...x) {
  editor.console += '!> ' + x.join(' ') + '\n';
}

function edlog(...x) {
  editor.console += '?> ' + x.join(' ') + '\n';
}

function edcon() {
  var x = editor.console.split('\n');
  while (x.length > 40) x.shift();
  x.forEach((x, i) => __.text(x, 0, i * 18, "white", 13, "black", 2))
}