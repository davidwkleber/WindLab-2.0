
module.exports = serialListener;
var windSpeedValue = 0;
var dummyLoadValue = 1;
var pitchAngleValue = 1;


// var app = require('./app');
var portConfig = require('./portConfig.json');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
// var SerialPort = require("serialport").SerialPort

var simpleJson = {
  "date": "19/5/2015:16:6:66:666",
  "voltage":     0,
  "current":    6,
  "rpm":    0,
  "power":    0,
  "timestamp": 3125413672,
  "windSpeed": 0,
  "pitchAngle": -10,
  "dummyLoad": 0
 }
console.log('ports ' + portConfig.measurement.port);

	DIserialPort = new SerialPort(portConfig.measurement.port, {
		baudrate: portConfig.measurement.baudrate,
		
		parser: serialport.parsers.readline("EOL"),
	}, function (err) {
		if (err) console.log('Eroror opening measurement  port: ' +  portConfig.measurement.port);
	});

function sleep(time, callback) {
// serialListener.prototype.sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
};


/*
var socketServer;
var socketio = require('socket.io');
socketServer = socketio.listen(app, true);
*/
function serialListener()
{	//
	//
	//http://www.barryvandam.com/node-js-communicating-with-arduino/ 
	//copied from the server.js file
	var receivedData = "";
    var sendData = "";
	var delimiter = "\n";
	
 console.log('serialListenerInit called ');

io = require('socket.io').listen(1337);


console.log('serialListener: setup connection now');

io.sockets.on('connection', function(socket){
	console.log('a user connected');
	console.log('connected socket: '+socket.id);


    socket.on('disconnect', function(){
    console.log('user disconnected');
    console.log('socket disconnected' + socket.id+ " " + socket.disconnected);
  });
  

});

 
   DIserialPort.on("open", function () {
		console.log('serialListener.DIserialPort.on Open ' + portConfig.measurement.port);

        sleep(2000, function() {
		});
		
		serialListener.write('DI', 'AA');

			// serialListener.write('DI', 'AA');

		//asserting();
	});
 
 
			

  }; 
 
 var sendData = '';
 var receivedData = '';
 var chunksIn = 0;
 function handleDIserialPortData(data) {
 
 
    // DIserialPort.on('data', function(data) {
	//		console.log('DataInput : '+data);

		chunksIn = chunksIn+1;
        receivedData += data.toString();

			var jsonOpened = receivedData.indexOf('{');
			var jsonClosed = receivedData.indexOf('}', jsonOpened);

		if( jsonClosed !== -1 && jsonOpened !== -1 ) {
			if ( jsonClosed > jsonOpened ) {
				sendData = receivedData.substring(jsonOpened, jsonClosed+1);
				receivedData = receivedData.substring(jsonClosed+2, receivedData.length);'';
				chunksIn = 0;
			}
		 }
         // send the incoming data to browser with websockets.
		if (sendData.length > 0 ) {
			// have to parse the string sendJSON to a JSON object in order to adjust RPM
			// dataItem = JSON.parse(sendJSON);
	//		dataItem = JSON.parse(sendData);
	
			// adjust RPM due to Arduino issues.
	//		dataItem.rpm = Math.floor(dataItem.rpm / 1000);

			// have to put JSON dataItem back into a string to send properly, why things cannot handle JSON objects???
	//	 io.emit('updateData', JSON.stringify(dataItem));
			 io.emit('updateData', sendData);

			sendData = null;
			receivedData = null;
			jsonClosed = null;
			jsonOpened = null;

		};
	}; 
 
 process.on('message', function(m) {
	console.log('serialListener got message '+m);
	serialListener();
});

process.on('interfaceData', function(idata) {
	console.log('serialListener got interface message '+idata);
});
   
DIserialPort.on('data', handleDIserialPortData) ;



serialListener.doSomething = function() {
	console.log('serialListener.doSomething here');
};

// function write (id, value) {
serialListener.write = function( id, value ) {
	console.log('serialListener write value: '+value);

     sleep(200, function() {
    }); 
	
	console.log('serialListener write value: '+value);
	if (id === 'DI') {
		console.log('DIserialListener.write '+value);

		DIserialPort.write(value, function(err, results) {
			console.log('DI_err ' + err);
			console.log('DI_results ' + results);
		});
	} else {
		console.log('bad id '+id);
	};
	

};

function asserting() {
  console.log('asserting');
	DIserialPort.set({rts:true, dtr:true}, function(err, something) {
	  console.log('DLserialPort asserted');
		setTimeout(clear, 250);
	});
}

function clear() {
	console.log('clearing');
	DIserialPort.set({rts:false, dtr:false}, function(err, something) {
	  console.log('DLserialPort clear');
		setTimeout(done, 50);
	});
}

function done() {
	console.log("DLserialPort done resetting");
}
