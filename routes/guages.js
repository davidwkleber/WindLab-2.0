
//
// module for recording and saving data measurements
//


var express = require('express');
var router = express.Router();
var io = require('socket.io');


// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('guages Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('guages get');
 	res.render('guages');
})

router.post('/', function(req, res, next){

console.log('guages post');


})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.redirect('guages');
})

module.exports = router;

	