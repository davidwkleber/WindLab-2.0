



		var recordDataItem;
		var recordedData;
	//	var recordSocket;
		var recordDataFlag = false;
			recordedData = [];
		var recordSelection = "off";
					var theStart = new Date().getSeconds();


					function handleRecordData(dataIn) {
						// console.log('record update raw: ' + data);
										// add the client based data to the data object
	
						if( recordDataFlag) {
			//					console.log("add: dataIn"+dataIn);
				data = addWindPitchCurrentToData(dataIn);
			// console.log("add: data" +data);
							recordDataItem = JSON.parse(data);
						// 	console.log('record updateData.power  ' + recordDataItem.power);
							recordedData.push(data);
					
							var theVal = (new Date() - theStart)/1000; 
							console.log(" the recordTime is: "+theVal);
							$("#recordTime span").text(theVal+" sec");
 
						}
					};	
			dataSocket.on('updateData', handleRecordData );

		function recordFunction() {
	//		console.log('start recording');
			$('#recordButton').css('background-color','#f47121');
			recordDataFlag = true;
			 theStart = new Date();

			$("#recordTime span").text("0 sec");

		}
		function stopRecordFunction() {
		//	console.log('stop recording');
			recordDataFlag = false;
					console.log('record button in stopRecordFunction  is: '+$(".recordButtons-checkbox:checked").val());

			 $(".recordButtons-checkbox").prop("checked", "on")

			$('#recordButton').css('background-color','#e8e8e8');
			// recordsocket.disconnect();
			
			$("#recordTime span").text("0 sec");
		}
		
		function saveDataFunction() {
			//		console.log('record button in saveDataFunction is: '+$(".recordButtons-checkbox:checked").val());

			if ( recordDataFlag === true ) {
					stopRecordFunction()
			}
	//		console.log('save data');
	//		console.log('recorded data saved: '+recordedData);
			
		//	recordDataFlag = false;

			// $('#recordButton').css('background-color','#e8e8e8');
						
			// var json = JSON.stringify(recordedData);
			var json = recordedData;
		//	var blob = new Blob([json], {type: "application/json"});
			
			var tsv = JSON2TSV("["+json+"]");
			var blob = new Blob([tsv], {type: "application/csv"});
	
			var url = URL.createObjectURL(blob);
			
			var a = document.createElement('a');
			a.id = "saveDataLinkPlace";
			var date = new Date();
			var fileName = "data."+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" "+date.getHours()+"."+date.getMinutes()+".tsv";
			a.download = fileName;
			a.href = url;
			a.textContent = "Download data as JSON";
			
			saveAs(blob,fileName);

			recordedData = []

		}
		
				$( ".recordButtons-checkbox" ).on( "click", function() {

		//	console.log("INIT on click");
				recordSelection = $(".recordButtons-checkbox:checked").val();
			//	console.log("init on? "+PAinitSelection);
				if (recordSelection != "on") {
					console.log("Record ONNNN");
					recordFunction()
		
				} else {
					console.log("Record OFF");
		//						 console.log('record button is: '+$(".recordButtons-checkbox:checked").val());

					if ( recordDataFlag === true ) {
						stopRecordFunction()
						// saveDataFunction()
					}
				}
		 });

