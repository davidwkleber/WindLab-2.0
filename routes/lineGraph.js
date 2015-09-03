
//
// module for setting Wind Speed of the wind fan
//


var express = require('express');
var router = express.Router();

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('lineGraph Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('lineGraph get');
 	res.render('timeDomainGraph');
})

router.post('/', function(req, res, next){

console.log('lineGraph post');


})

router.put('/', function(req, res, next){
	var socketCmd = req.param('socketCmd', null);
		switch (socketCmd) {
			case 'disconnect':
				lineGraphSocket.disconnect();
			break;
		default:
			console.log("put lineGraph socketCmd: "+socketCmd);
			break;
		}
	// res.render('timeDomainGraph');
})

router.get('/about', function(req, res){
	res.send('wind speed About page');
})

module.exports = router;

	