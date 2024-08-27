var mp = {
  ws: null,
  si: false,
  state: '',
  menustarttimeout: false,
};

function menu() {
  if (!ge.lastmenu)
    ge.menufade = 0;
  ge.menufade += (32 - ge.menufade) / 3;
  __.img(ge.screen, [-ge.menufade, -ge.menufade, WIDTH + ge.menufade * 2, HEIGHT + ge.menufade * 2]);
  __.rect(0, 0, WIDTH, HEIGHT, '#000' + Math.round(ge.menufade / 3).toString(16));
  var w = WIDTH / 5;
  var h = HEIGHT / 5;

  _.save();
  _.globalAlpha = ge.menufade / 32;
  _.translate(w - 8, h - 8);
  __.rect(0, 0, w * 3 + 16, h * 3 + 16, '#222', '#888', 2);

  if (ge.menu == 'mp') {
    __.text('multiplayer', 10, 10, 'white', 30, 'black', 2)
    if (ge.lastmenu != 'mp') {
      loginMp()
    }
    __.text(
      (mp.state ? mp.state + ', ' : '') +
      ['connecting', 'open', 'closing', 'closed'][(mp.ws ?? { readyState: 3 }).readyState],
      10, 40, 'white', 20, 'black', 2
    );
    if (mp.ws && mp.ws.readyState == 1 && !mp.menustarttimeout)
      mp.menustarttimeout = setTimeout(() => { ge.menu = ''; mp.menustarttimeout = false }, 1e3);
  }

  if (ge.menu == 'disconnect') {
    __.text('disconnected', 10, 10, 'white', 30, 'black', 2);
    __.text('please reload', 10, 40, 'white', 20, 'black', 2);
  }

  _.restore();
  __.text('X', w * 4 - 20, h, 'red', 20, 'red', 2);
  if (
    input.m.l &&
    input.m.x > w * 4 - 20 && input.m.x < w * 4 &&
    input.m.y > h && input.m.y < h + 20
  )
    ge.menu = '';
}

function loginMp() {
  if (mp.ws)
    mp.ws.close();
  mp.si = false;
  mp.ws = new WebSocket('');
  mp.ws.onclose = () => {
    if (mp.si == false)
      mp.state = 'failed';
    else
      ge.menu = 'disconnnect';
    mp.si = false;
    mp.ws = null;
  };
  mp.ws.onopen = () => {
    mp.state = '';
    mpStart();
  }
}

function mpStart() {

}

function namegen() {
  var x = {
    adjectives: [
      "brave", "curious", "swift", "playful", "fierce", "gentle", "loyal", "majestic", "clever", "calm",
      "eager", "fearless", "graceful", "mighty", "shy", "sly", "diligent", "energetic", "friendly", "grumpy",
      "hungry", "intelligent", "jumpy", "lazy", "noble", "proud", "quick", "quiet", "restless", "sharp",
      "silly", "smart", "strong", "thoughtful", "timid", "wild", "zany", "vibrant", "wise", "witty",
      "agile", "courageous", "determined", "foolish", "happy", "independent", "observant", "patient", "reliable", "stubborn"
    ],
    animals: [
      "dog", "cat", "elephant", "lion", "tiger", "giraffe", "zebra", "rabbit", "wolf", "dolphin",
      "horse", "bear", "kangaroo", "penguin", "shark", "crocodile", "owl", "snake", "turtle", "parrot",
      "whale", "eagle", "fox", "panda", "leopard", "raccoon", "bat", "octopus", "frog", "hamster",
      "deer", "cheetah", "koala", "rhino", "hedgehog", "otter", "lobster", "squirrel", "chimpanzee", "sloth",
      "camel", "flamingo", "peacock", "buffalo", "goat", "sheep", "alpaca", "hippopotamus", "antelope", "bison"
    ],
  };

  var r = l => {
    var x = l[Math.floor(Math.random() * l.length)];
    var y = x.split('');
    var z = y.shift();
    return z.toUpperCase() + y.join('');
  };

  var n = Math.floor(Math.random() * 10000).toString();
  n = '0'.repeat(4 - n.length) + n;

  return (
    r(x.adjectives) +
    r(x.animals) + 
    n
  );
}
