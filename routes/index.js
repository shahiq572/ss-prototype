var express = require('express');
const fs = require("fs");
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
  console.log(results[1]);
  res.render('timeline1', {results: results});
});


router.post('/save-results', function (req, res) {
  
  fileContent = req.body.timeTaken + "," + req.body.clickCount;

  if (!fs.existsSync('./data/')){
    fs.mkdirSync('./data/');
  }

  fs.writeFile("./data/"+req.body.name+'_'+Date.now()+'.csv', fileContent , function(err) {
    if (err) throw err;
    console.log('Saved!', req.body.name);
  });
})



module.exports = router;
