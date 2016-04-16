# websocket-opc
WebSocket Server for Open Pixel Protocol. Inspired by Fadecandy and node-openpixelcontrol

This node script runs only on the raspberry pi.
It starts a WebSocket Server on port 8080.

##Installation
npm install

##RUN
sudo node server.js

This has to run as super user, because the ws281x lib needs it.


##HOW TO USE IT
Open the connection on __port 8888 with your web browser__ and you will see the 8x8 grid example by fadecandy.
Just edit index.html in the static folder to fit your needs.


You can also  try the HTML examples provided by [https://github.com/scanlime/fadecandy]. Make sure to change the URL in the HTML file to match your server address and port 8080.
