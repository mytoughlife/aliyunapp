
var restify = require('restify');
var Logger = require('bunyan');
var fs = require('fs');
var readline = require('readline');

var logFile = 'log.txt';

var log = new Logger({
  name: 'jason-aliyun-app',
  streams: [
    {
      path: logFile,
      level: 'trace'
    }
  ],
});

log.trace('[-SELF-LOGGING-] Creating server ...');

// set up server
var server = restify.createServer();


server.get('/proc', function(req, res) {
    
    log.trace('[-SELF-LOGGING-] Requesting proc');

    var data = {
        env: process.env,
        argv: process.argv,
    };
    res.send(data);
});


server.get('/log', function(req, res){

    var allLines = [];

    var rd = readline.createInterface({
        input: fs.createReadStream(logFile),
        output: process.stdout,
        console: false
    });

    rd.on('line', function(line) {
        allLines.push(line);
    });


    rd.on('close', function() {
        res.send(allLines);
    });

});


server.get(/.*/, restify.serveStatic({
    directory: '.',
	default: 'index.html',
    maxAge: 0
}));

// Start the app by listening on <port>
var port =  process.env.PORT || 3000;
server.listen(port);
console.log('App started on port ' + port);

log.trace('[-SELF-LOGGING-] App started.');
