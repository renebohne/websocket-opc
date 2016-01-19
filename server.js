var ws281x = require('rpi-ws281x-native');
var WebSocketServer = require('ws').Server, wss= new WebSocketServer({port:8080});

var express = require('express');
var app = express();
var server = app.listen(8888);
app.use(express.static(__dirname + '/static'));

//64 LEDs for 8x8 matrix
ws281x.init(64);

process.on('SIGINT', function(){
	ws281x.reset();
	process.nextTick(function() { process.exit(0);})
});

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message, flags) {
		if(flags.binary)
		{
			
			if(message == null)
			{
				return;
			}

			var len = message.length;

			if(len< 4)
			{
				return;
			}
			
			var uint8 = new Uint8Array(message);
			var uint32 = new Uint32Array(64);
			var count = 0;
			for(var i=4; i<uint8.length;i=i+3)
			{
				uint32[count] = (uint8[i] << 16) | (uint8[i+1] <<8) | uint8[i+2];
				count++;
			}
			ws281x.render(uint32);
			

		}
		else
		{		
			console.log('received: %s', message);
		}
	});

	ws.send('something');
});
