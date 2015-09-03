

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
console.log('route index get ');
console.log('index: dataFrameContent: ' + dataFrameContent );
	res.render('index', { title: 'WindLab', iFrameContent: iFrameContent, dataFrameContent: dataFrameContent });
 	// serialListener();
});

module.exports = router;
