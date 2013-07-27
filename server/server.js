var http = require('http'),
    fs = require('fs');

var testFile = '/Users/landon/WITJ_Metallica.mp3';

var text = 'text/plain';
var audio = 'audio/mpeg';

var generateHeader = function(res, range, size) {
  var headers = {
    'Accept-Ranges': 'bytes',
    'Content-Length': size.toString(),
    'Content-Type': audio,
  };
  if (range) {
    headers['Content-Range'] = 'bytes 0-' + range + '/' + size.toString();
    res.writeHead(206, headers);
  } else {
    res.writeHead(200, headers);
  }
};

var requestHandler = function(req, res) {
  console.log('request received');
  console.log(req.headers['Range']);
  var range = req.headers['Range'];
  fs.stat(testFile, function(err, stats) {
    if (err) return console.log(err); // Exit on error
    
    opts = {};
    if (range) opts.start = range; 
    generateHeader(res, range, stats.size);
    var stream = fs.createReadStream(testFile, opts);
    stream.on('readable', function() {
      res.write(stream.read());
    });
    stream.on('end', function() {
      res.end('');
    });
  });
};

http.createServer(requestHandler).listen(8080); // listens on any IPv4 address
