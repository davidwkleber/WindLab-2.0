
module.exports = serialWriter;

var portConfig = require('./portConfig.json');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

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
console.log('ports '+ portConfig.stepper.port +" "+ portConfig.windSpeed.port );

   
   PAserialPort = new SerialPort(portConfig.stepper.port, {
 
		// test rig
		// baudrate: 9600,
		
		// wind tower
		baudrate: portConfig.stepper.baudrate,

	}, function (err) {
		if (err) console.log('Eroror opening Pitch Angle port: ' +  portConfig.stepper.port);
	});
	  
   WSserialPort = new SerialPort(portConfig.windSpeed.port, {
		baudrate: portConfig.windSpeed.baudrate,
	}, function (err) {
		if (err) console.log('Eroror opening Wind Speed port: ' +  portConfig.windSpeed.port);
	});
		
	DLserialPort = new SerialPort(portConfig.loadController.port, {
		baudrate: portConfig.loadController.baudrate,
	}, function (err) {
		if (err) console.log('Eroror opening dummy load  port: ' +  portConfig.loadController.port);
	});



function sleep(time, callback) {
// serialWriter.prototype.sleep(time, callback) {
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
 function serialWriter()
{	};

	//
	//
	//http://www.barryvandam.com/node-js-communicating-with-arduino/ 
	//copied from the server.js file
	var receivedData = "";
    var sendData = "";
	var delimiter = "\n";
	
 console.log('serialWriterInit called ');


console.log('serialWriter: setup connection now');

    WSserialPort.on("open", function () {
		console.log('serialWriter.WSserialPort.on Open ' + portConfig.windSpeed.port);

		//
		//
		//My guess is, that the function sends to fast after the port opening. The uController is still in the reset stage
	
        sleep(2000, function() {
    // executes after two second, and blocks the thread, should be avoided. maybe we find another solution
		});
	});

	
    PAserialPort.on("open", function () {
		console.log('serialWriter.PAserialPort.on Open ' + portConfig.stepper.port);
		//
		//
		//My guess is, that the function sends to fast after the port opening. The uController is still in the reset stage

        sleep(2000, function() {
    // executes after two second, and blocks the thread, should be avoided. maybe we find another solution
    });
	
	DLserialPort.on("open", function () {
		console.log('serialWriter.DLserialPort.on Open ' + portConfig.loadController.port);
        sleep(2000, function() {
		});
		
	});
			

  }); 
 
 var sendData = '';
 var receivedData = '';
 var chunksIn = 0;

 function handleWSserialPortData(data) {
 //   WSserialPort.on('data', function(data) {
         receivedData += data.toString();
	}; 
	
	function handlePAserialPortData(data) {
 //   PAserialPort.on('data', function(data) {
         receivedData += data.toString();
	}; 
	
	function handleDLserialPortData(data) {
  //  DLserialPort.on('data', function(data) {
         receivedData += data.toString();
	}; 
   
WSserialPort.on('data', handleWSserialPortData) ;
PAserialPort.on('data', handlePAserialPortData) ;
DLserialPort.on('data', handleDLserialPortData) ;

// };


serialWriter.write = function( id, value ) {
	console.log('serialWriter write value: '+value);

   //  sleep(200, function() {
   // }); 
	
	console.log('serialWriter write value: '+value);
	if( id === 'w' ) {
	// setImmediate(WSserialPort.write(value, function(err, results) {
			WSserialPort.write(value, function(err, results) {

			console.log('Blink_err ' + err);
			console.log('Blink_results from windSpeed ' + results);
		});
	} else if (id === 'PA') {
		console.log('PAserialWriter.write '+value);

		PAserialPort.write(value, function(err, results) {
			console.log('PitchAngle ' + err);
			console.log('PitchAngle ' + results);
		});
	} else if (id === 'DL') {
		console.log('DLserialWriter.write '+value);

		DLserialPort.write(value, function(err, results) {
			console.log('loadController ' + err);
			console.log('loadController ' + results);
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

function reutrnWindSpeed( windSpeedValueIn ) {
		var windSpeedValueText = (windSpeedValueIn*0.1456)-0.5523;
		windSpeedValueText =  +(Math.round(windSpeedValueText +"e+1")+"e-1");
		if ( windSpeedValueText < 0 ) {
			windSpeedValueText = 0;
		}		
		return windSpeedValueText;
}		

function returnPitchAngle( pitchAngleIn ) {
	return  (pitchAngleIn-101)/10;
}

function returnDummyLoad( dummyLoadIn ) {
	var dummyLoadValueText = ((dummyLoadValue-1)/201)*100;
		dummyLoadValueText =  +(Math.round(dummyLoadValueText +"e+1")+"e-1");
	return dummyLoadValueText;
}
