			
			
			if ( dataSocket ) {
				console.log('in socket '+dataSocket);
				if ( dataSocket.connected == 'true' ) {
								console.log('in socket '+dataSocket.connected);
				} else {
					dataSocket = io.connect('http://127.0.0.1:1337');
				}
			} else {
							console.log('no dataSocket');

				 var dataSocket = io.connect('http://127.0.0.1:1337');
			}

			console.log('dataSocket.connected: '+dataSocket.connected);

			dataSocket.on('connect', function (connectData) {
					console.log('dataSocket client connected ');
			});
			
			var measurementData_limit = 500;
			var measurementData = [];
			
			function handleSocketData(dataIn) {
				measurementData.push(dataIn);
				if ( measurementData.length > measurementData_limit ) {
					measurementData.shift();
				}
				// console.log("handleSocketData "+ measurementData);
			
			};
			
			// dataSocket.on('updateData', handleSocketData );
