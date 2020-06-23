var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
const app = require('../app.js');


router.get('/',
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
       params = {
        active: { notes: true }
      };


      

    }
    res.render('notes');
});

router.post('/getNote', (req, res) =>{
    var note = req.body.note;
    console.log(note);

    res.redirect('/notes');
});

module.exports = router;