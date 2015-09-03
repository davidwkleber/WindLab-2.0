

$(document).ready(function() {
	    
		$("#topFrameBody").click(function(event){
			var target = event.target;
			console.log("got into main "+target.id);
			console.log(target.name);

			switch(target.id) {
				case "tourFrame":
							console.log("got into tourFrame");	
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleLineGraphData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleRecordData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleGuageData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handlePowerCurveData );

					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("./rightFrame/introMain.html");
					
					window.parent.$("#guageDiv").empty();
					window.parent.$("#guageDiv").load("/guages");

					break;
				case "powerCurveGraph":
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleLineGraphData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleRecordData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleGuageData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handlePowerCurveData );
					console.log("got into powerGraph");
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/powerCurve");
					
					window.parent.$("#guageDiv").empty();
					window.parent.$("#guageDiv").load("/guages");

					break;
				case "timeDomainGraph":
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleLineGraphData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleRecordData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handleGuageData );
					window.parent.dataSocket.removeListener( 'updateData', window.parent.handlePowerCurveData );
					console.log("got into timeGraph");
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/lineGraph");
					
					window.parent.$("#guageDiv").empty();
					window.parent.$("#guageDiv").load("/guages");

				break;
				default :
					console.log("id is: "+target.id);
					break;
			}
	
		})

	})