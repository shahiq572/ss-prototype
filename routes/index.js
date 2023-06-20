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
  // console.log("reqbody:", req.query.q);
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


/* Google Tasks */

// Task Set A
router.get('/g_task1a', function(req, res, next) {
  res.render('./googletasks/task1a_queen/queenelizabeth.ejs', 
              { title: 'Task 1 - Queen Elizabeth',
                taskname: "gtask1a",
                pageHeader: "Queen Elizabeth"
              });
});

router.get('/g_task2a', function(req, res, next) {
  res.render('./googletasks/task2a_brexit/brexit.ejs', 
              { title: 'Task 2 - Brexit transition period',
                taskname: "gtask2a",
                pageHeader: "Brexit"
              });
});

router.get('/g_task3a', function(req, res, next) {
  res.render('./googletasks/task3a_hopkins/anthony_hopkins.ejs', 
              { title: 'Task 3 - Anthony Hopkins',
                taskname: "gtask3a",
                pageHeader: "Anthony Hopkins"
              });
});


module.exports = router;
