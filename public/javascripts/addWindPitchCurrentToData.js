   
   function addWindPitchCurrentToData( sendData ) {

	 // send the incoming data to browser with websockets.
		if (sendData.length > 0 ) {
			var now = new Date();
			var formatNow = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+'\:'+now.getHours()+'\:'+now.getMinutes()+'\:'+now.getSeconds()+'\:'+now.getMilliseconds();
		
		/* use the same calculation for changin wind speed % to a m/s value
			this is from windsock.ejs. 
			Not the best I know, but hope it works, otherwise windSpeedValue was a percentage...
		*/
		var windSpeedValueText = reutrnWindSpeed(windSpeedValue);

		/* do the same for the pitch angle.
		*/
		var pitchAngleValueText = returnPitchAngle(pitchAngleValue);
		
		/* and dummy load
			NOTE, the magic number 201 is from DLnumFrames in the dummyLoad.ejs file
		*/
		var dummyLoadValueText = returnDummyLoad(dummyLoadValue);
		
			// console.log('SEND update data : '+sendData);
			
			//start with the date
			var sendJSON = '{\n  \"date\": \"'+formatNow+'\",';
			// put in the JSON from the serial input next
			sendJSON += sendData.substring(1, sendData.length-3);
			// now add the info local to the interface, wind speed, pitch angle and dummy load
			sendJSON += ",\n  \"windSpeed\": "+windSpeedValueText+",\n";
			sendJSON += "  \"pitchAngle\": "+pitchAngleValueText+",\n";
			sendJSON += "  \"dummyLoad\": "+dummyLoadValueText+"\n";
			sendJSON += "}";
			// have to parse the string sendJSON to a JSON object in order to adjust RPM
			dataItem = JSON.parse(sendJSON);
			// adjust RPM due to Arduino issues.
			dataItem.rpm = Math.floor(dataItem.rpm / 1000);
	
			// have to put JSON dataItem back into a string to send properly, why things cannot handle JSON objects???
		//	io.emit('updateData', JSON.stringify(dataItem));

			sendJSON = null;
			sendData = null;
			dummyLoadValueText = null;
			pitchAngleValueText = null;
			windSpeedValueText = null;
			now = null;
			receivedData = null;
			jsonClosed = null;
			jsonOpened = null;
			
			// console.log("in SerialListener: the wind speed: "+windSpeedValue);
			// console.log("in SerialListener: the pitch angle: "+pitchAngleValue);
			// console.log("in SerialListener: the dummy load: "+dummyLoadValue);

			return JSON.stringify(dataItem);
		};
		
		};
		
		
function reutrnWindSpeed( windSpeedValueIn ) {
		var windSpeedValueText = (windSpeedValueIn*0.1456)-0.5523;
		windSpeedValueText =  +(Math.round(windSpeedValueText +"e+1")+"e-1");
		if ( windSpeedValueText < 0 ) {
			windSpeedValueText = 0;
		}		
		return windSpeedValueText;
}	;	

function returnPitchAngle( pitchAngleIn ) {
	return  (pitchAngleIn-101)/10;
};

function returnDummyLoad( dummyLoadIn ) {
	var dummyLoadValueText = ((dummyLoadValue-1)/201)*100;
		dummyLoadValueText =  +(Math.round(dummyLoadValueText +"e+1")+"e-1");
	return dummyLoadValueText;
};

		