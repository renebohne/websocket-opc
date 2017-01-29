var ws281x = require('rpi-ws281x-native');
var WebSocketServer = require('ws').Server;
var wss= new WebSocketServer({port:8080});
var path = require('path');

var mode = 0;
var NUM_LEDS = 32;

var express = require('express');
var app = express();
//var server = app.listen(8888);
app.use(express.static(__dirname + '/static'));
//app.use(express.static(path.join(__dirname, 'static')));
app.listen(8888);
//32 LEDs for Krawatte
ws281x.init(32);

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
			var uint32 = new Uint32Array(32);
			var count = 0;
			for(var i=4; i<uint8.length;i=i+3)
			{
				uint32[count] = (uint8[i] << 16) | (uint8[i+1] <<8) | uint8[i+2];
				count++;
			}
			mode = 1;
			ws281x.render(uint32);
			

		}
		else
		{		
			console.log('received: %s', message);
		}
	});

	ws.send('something');
});

function getRadiationColor(radiation)
{
  if(radiation>28)
  {
    return rgb2Int(255,0,0);
  }
  else if(radiation>20)
  {
    return rgb2Int(255,200,0);
  }
  else if(radiation>14)
  {
    return rgb2Int(0,255,0);
  }
  return rgb2Int(0,0,255);

}

var pixelData = new Uint32Array(32);
var offset =0; 

if(mode == 0)
{
  setInterval(function(){

  var radiation = Math.random()*27+5;
  for(var i=0; i<NUM_LEDS;i++)
  {
    if(i<radiation)
    {
    	pixelData[i] = getRadiationColor(radiation);
    }
    else
    {
        pixelData[i] = 0;
    }  
}
  ws281x.render(pixelData);
  }, 10000);
}

else if(mode == 5)
{
	
	setInterval(function () {
  		for (var i = 0; i < NUM_LEDS; i++) {
    			pixelData[i] = colorwheel((offset + i) % 256);
  		}

  		offset = (offset + 1) % 256;
  		ws281x.render(pixelData);
	}, 1000 / 30);
}

// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);

}
