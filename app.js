var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

var SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

var port = new SerialPort("COM9", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

var app = http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(index);
});

port.on('error', function(err) {
    console.log('Error with serial port: ' + err);
  });

var io = require("socket.io").listen(app);

io.on("connection", function (socket) {
    console.log("Client connected");
  
    // Listen for data from the serial port
    parser.on("data", function (data) {
      console.log("Received data from port: " + data);
      
      // Send the data to the connected client
      socket.emit("data", data);
    });
  });;

app.listen(3000, function () { 
    console.log("Server running at http://localhost:3000/");
});