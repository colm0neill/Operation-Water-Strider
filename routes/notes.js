var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers.js');
const app = require('../app.js');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;


function checkAuth (req, res, next) {
  if (!req.isAuthenticated()) {
    // Redirect unauthenticated requests to home page
    res.redirect('/')
    console.log("oops looks like you not authenticated.")
  }else{
  next()
  }
}



router.get('/',
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
      params = {
        active: { notes: true }
      };

      var accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }
      


      res.render('notes', params);
    }
    });



router.post('/create', async (req, res) => {

  var theCode = req.body;
  
  var cfg = {};
 
  var converter = new QuillDeltaToHtmlConverter(theCode.ops, cfg);
   
  var html = converter.convert();
  
  console.log(html)

  
res.json(theCode);

})



// router.post('/getNote', async (req, res) => {
//   var note = req.body.note;
//   console.log(note);


//   if (noteBookID !== " ") {

//     try {
//       var noteAdded = await graph.addNote(accessToken, note, noteBookID);
//       params.noteAdded = noteAdded.value;

//       console.log(noteAdded.value);

//     }
//     catch (err) {
//       console.log(err);
//       console.log("ERROR: Couldnt get to getCalendarID()");
//     }
//   }
//   else {
//     console.log("there was an issue.")
//   }




//   res.redirect('/notes');
//   //res.send('Your note was added sucessfully!');
// });

module.exports = router;