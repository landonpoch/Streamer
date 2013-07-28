var http = require('http'),
    fs = require('fs');

var testFile = '/Users/landon/WITJ_Metallica.mp3';
var text = 'text/plain';
var audio = 'audio/mpeg';

var requestHandler = function(req, res) {
  var range = getRange(req);
  var streamFile = function(err, stats) {
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
  };
  fs.stat(testFile, streamFile);
};

http.createServer(requestHandler).listen(8080); // listens on any IPv4 address

var generateHeader = function(res, range, size) {
  var headers = {
    'Accept-Ranges': 'bytes',
    'Content-Type': audio,
  };
  if (range != undefined) {
    headers['Content-Length'] = size - range;
    headers['Content-Range'] = 'bytes ' + range + '-' + (size - 1) + '/' + size;
    res.writeHead(206, headers);
    console.log(headers['Content-Range']);
  } else {
    headers['Content-Length'] = size;
    res.writeHead(200, headers);
  }
};

var getRange = function(req) {
  console.log(req.headers['range']);
  var range = req.headers['range'];
  var re = /bytes=(\d.*?)-$/;
  range = re.exec(range);
  if (range) range = parseInt(range[1]);
  console.log(range); 
  return range; 
}
