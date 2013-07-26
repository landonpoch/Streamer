var http = require('http'),
    fs = require('fs');

var testFile = '/Users/landon/WITJ_Metallica.mp3';

var text = 'text/plain';
var audio = 'audio/mpeg';

var generateHeader = function(res, size) {
  var headers = {
    'Accept-Ranges': 'bytes',
    'Content-Length': size.toString(),
    'Content-Range': 'bytes 0-1000/' + size.toString(),
    'Content-Type': audio,
  };
  res.writeHead(200, headers);
};

var requestHandler = function(req, res) {
  console.log('request received');
  fs.stat(testFile, function(err, stats) {
    if (err) return console.log(err); // Exit on error
    
    generateHeader(res, stats.size);
    var stream = fs.createReadStream(testFile, {start: 1000, end: stats.size});
    stream.on('readable', function() {
      res.write(stream.read());
    });
    stream.on('end', function() {
      res.end('');
    });
  });
};

http.createServer(requestHandler).listen(8080); // listens on any IPv4 address
