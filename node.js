const http = require('http');
const fs = require('fs');
function type(t) {
  var x = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    json: 'application/json',
    xml: 'application/xml',
  };
  return x[Object.keys(x).find(y => t.endsWith(y))];
};

var svr = http.createServer((req, res) => {
  var url = req.url;
  if(url.endsWith('/'))
    url += 'index.html';
  fs.readFile('src' + url, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
      console.log(`404 ${url}`);
    } else {
      res.writeHead(200, { 'Content-Type': type(url) });
      res.end(data);
      console.log(`200 ${url}`);
    }
  });
});
svr.listen(8080);