var mp = {};

function menu() {
  __.img(ge.screen);
  __.rect(0, 0, WIDTH, HEIGHT, '#0008');
  var w = WIDTH/5;
  var h = HEIGHT/5;
  __.rect(w-8, h-8, w*3+16, h*3+16, '#222');
  if (ge.menu == 'mp') {
  }
  __.text('X', w*4-20, h, 'red', 20, 'red', 2);
  if(
    input.m.l && 
    input.m.x > w*4-20 && input.m.x < w*4 &&
    input.m.y > h && input.m.y < h+20 
  )
  ge.menu = '';
}

function loginMp(){
  mp.ws = new WebSocket('localhost');
}