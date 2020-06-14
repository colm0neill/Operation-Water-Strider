var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var fs = require('fs');

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
          
            }
          }
       
      }
      
     
      if (accessToken && accessToken.length > 0 && idofCalendar !== '') {
       
        try {
          // Get the events
          var eventsOneXOne = await graph.getOneEvents(accessToken);
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

      var theDate;


      router.post('/api', (req, res) => {
        const data = req.body;
        
        res.json({
          status:'SUCCESS: Date Received.'
        });
        theDate = data.dateFormatted;
        exports.theDate = theDate;
        setTimeout(processDate,100, accessToken, theDate); 
      });


     

async function processDate(accessToken, theDate){
  var z = await theDate;

 
    
console.log("Server is requesting events for: "+ z);
        

      if (typeof(theDate) !== 'undefined') {
       
        
        try {
          console.log('im trying');
          var dayOne = await graph.getOneEventsOD(accessToken);
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

     writeParams();
    }
  function writeParams(params){
    
    
  }

    


      res.render('calendar', params);
    }
  
);
// </GetRouteSnippet>

module.exports = router;