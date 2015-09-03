
//
// module for setting Wind Speed of the wind fan
//


var express = require('express');
var router = express.Router();

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('powerCurve Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('powerCurve get');
 	res.render('powerCurve');
})

router.post('/', function(req, res, next){

	socketCmd = req.param('socketCmd', null);
	console.log("powerCurve Post, socketCmd: "+socketCmd);
	
	switch (socketCmd) {
		case 'disconnect':
			// powerCurveGraphSocket.disconnect();
			break;
		default:
			break;
		}

console.log('powerCurve post');
 
//	res.render('powerCurveGraph');

})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.render('powerCurve');
})

router.get('/about', function(req, res){
	res.send('wind speed About page');
})

module.exports = router;

	