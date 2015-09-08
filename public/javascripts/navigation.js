

$(document).ready(function() {
	    
		$("#topFrameBody").click(function(event){
			var target = event.target;
			console.log("got into main "+target.id);
			console.log(target.name);

			switch(target.id) {
				case "topFrame":
					removeListenersForData();
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("./rightFrame/introMain.html");

					break;
				case "logoFrame":
					removeListenersForData();
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("./rightFrame/index.html");

					break;
				case "powerCurveGraph":
					removeListenersForData();
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/powerCurve");

					break;
				case "timeDomainGraph":
					removeListenersForData();
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/lineGraph");

				break;
				default :
					console.log("id is: "+target.id);
					break;
			}
	
		})

	})
	
	function removeListenersForData() {
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleLineGraphData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleRecordData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleGuageData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handlePowerCurveData );
										
					window.parent.$("#guageDiv").empty();
					window.parent.$("#guageDiv").load("/guages");

	}