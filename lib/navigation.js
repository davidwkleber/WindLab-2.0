//	<script src='/lib/socket.io/socket.io.js'></script>

//	powerCurveGraphSocket = io.connect('http://127.0.0.1:1337');
lineGraphSocket = io.connect('http://127.0.0.1:1337');

// var lineGraphSocket;

$(topFrameBody).ready(function() {
	
	    $("#topFrameBody").click(function(event){
			var target = event.target;
			console.log("got into main "+target.id);
			console.log(target.name);

			switch(target.id) {
				case "tourFrame":
							console.log("got into tourFrame");	
						//	lineGraphSocket.disconnect();
						//	powerCurveGraphSocket.disconnect();
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("./rightFrame/tourFrameContent/index.html");
					break;
				case "powerCurveGraph":
					lineGraphSocket.disconnect();

					console.log("got into powerGraph");
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/powerCurve");
					break;
				case "timeDomainGraph":
					//						powerCurveGraphSocket.disconnect();
					console.log("got into timeGraph");
					window.parent.$("#rightFrame").empty();
					window.parent.$("#rightFrame").load("/lineGraph");
				//	window.parent.$("#rightFrame").load("record.html");

				break;
				default :
					console.log("id is: "+target.id);
					break;
			}
	
		})

	})