var FPS = 30;

var SQSIZE = 64;
var WSIZE = 30;
var HWSIZE = WSIZE / 2;

var PLRCON = {
  speed: 4,
  drag: 0.5,
};

var SHOWHIDDEN = false;

var EDMARGIN = 6;
var EDTAB = new V(64, 32);
var EDTOP = EDTAB.y + EDMARGIN * 2;
var EDHCNT = 5;
var EDWIDTH = SQSIZE * EDHCNT + EDMARGIN * 2;