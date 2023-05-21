var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET demo1-politics */
router.get('/demo1', function(req, res, next) {
  res.render('demo1', { title: 'Express' });
});

/* GET timelines */
router.get('/timeline-demo', function(req, res, next) {
  console.log("reqbody:", req.query.q);
  var results;
  if(req.query.q == "") {
    results = require("../assets/timeline/js/timeline_demo.json").results;
  } else {
  }
  results = require("../assets/timeline/js/timeline_demo.json").results;
  console.log(results);
  res.render('timeline1', {results: results});
});



module.exports = router;
