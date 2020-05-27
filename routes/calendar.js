var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');

var idofCalendar = '';



/* GET /calendar */
// <GetRouteSnippet>
router.get('/',
  async function(req, res) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
      var params = {
        active: { calendar: true }
      };

      // Get the access token
      var accessToken;
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
          var events = await graph.getEvents(accessToken);
          params.events = events.value;
        } catch (err) {
          req.flash('error_msg', {
            message: 'Could not fetch events',
            debug: JSON.stringify(err)
          });
        }
      } else {
        req.flash('error_msg', 'Could not get an access token');
      }

      
    
        for(var i = 0; i < events.value.length; i++){
          if(events.value[i].name == 'ONE 2 ONE'){
              idofCalendar = events.value[i].id;
              exports.idofCalendar = idofCalendar;
              console.log("idofcalendar"+idofCalendar);
            }
          }
       
      }
      
     
      if (accessToken && accessToken.length > 0 && idofCalendar !== '') {
       
        try {
          // Get the events
          var eventsOneXOne = await graph.getOneEvents(accessToken, idofCalendar);
          params.eventsOneXOne = eventsOneXOne.value;
          console.log("I got the events Boiiii");
        } catch (err) {
          req.flash('error_msg', {
            message: 'Could not fetch events',
            debug: JSON.stringify(err)
          });
        }
      } else {
        req.flash('error_msg', 'Could not get an access token');
      }

    


      res.render('calendar', params);
    }
  
);
// </GetRouteSnippet>

module.exports = router;