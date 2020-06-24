var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var fs = require('fs');
const tgraph = require('../graphTriggers');

var idofCalendar = '';
var theDate;
var accessToken;
var params;

/* GET /calendar */
// <GetRouteSnippet>
router.get('/',
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
      params = {
        active: { calendar: true }
      };


      // Get the access token
      accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }

     


    if (accessToken && accessToken.length > 0) {

      try {
        // Get the events
        var xm = " "
        xm = await tgraph.getCalId(accessToken);
        var eventsOneXOne = await graph.getOneEvents(accessToken, xm);
        params.eventsOneXOne = eventsOneXOne.value;
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not fetch events',
          debug: JSON.stringify(err)
        });
      }
    } else {
      req.flash('error_msg', 'Could not get an access token');
    }



    res.render('calendar',{addEvents: false});
  }
  
  }
);



router.post('/api', async (req, res) => {
  const data = req.body;

   theDate = data.dateFormatted;
   exports.theDate = theDate;

  try {
    
    await processDate(accessToken, theDate);

    res.redirect('calendar');
  }
  catch (e) {
    res.redirect('/404');
    res.json({
      status: 'SUCCESS: Date Received. Failed to process data.'
    });
  }
});




//this get function is being called from the post ('/api') that received the data and ran the function
// that connects with the graph api and gets the events for the date that the user clicked on. The processDate() function
//adds the new json objects to the params variable and trys to re-render the calendar.hbs file with the new parameter. 
//Currently the returned data can only be seen on /calendar/events if entered into the browser manually after
//clicking on a date.



router.get('/calendar', (req, res) => {
  console.log("i did this");
  res.render('paritals/addEvents', params);
});





async function processDate(accessToken, theDate) {
  var z = await theDate;



  console.log("Server is requesting events for: " + z);


  if (typeof (theDate) !== 'undefined') {


    try {
      var idofCalendar = await tgraph.getCalId(accessToken);
      var dayOne = await graph.getOneEventsOD(accessToken, theDate, idofCalendar);
      params.dayOne = dayOne.value;

      console.log(dayOne.value);


    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not fetch events',
        debug: JSON.stringify(err)
      });
    }
  } else {
    req.flash('error_msg', 'Could not get a date from the users post request');
    console.log('error: unable to await getOneEventsOD');

  }

  writeParams(params);
}
function writeParams(params) {


  //res.render('calendar', {dayOne: params});

}



module.exports = router;