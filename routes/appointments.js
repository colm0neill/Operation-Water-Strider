var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers');

var params;
var accessToken;

router.get('/',
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
       params = {
        active: { appointments: true }
      };

    }
    res.render('appointments');
});

router.post('/getAppointmentDet', async (req, res) =>{

    const appointmentDetails = {
        subject: "ONEXONE-"+req.body.firstName+" "+req.body.lastName,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        phone: req.body.phone,
        device : req.body.device,
        content: req.body.appNote,
        scheduledBy: req.body.scheduledBy,
        scheduledFor: req.body.scheduledFor,
        vodaStore: '45 William Street, Galway'
    }

    const appointTimeDate = {
        appointmentLength: req.body.appointmentLength,
        dateTime: req.body.dateTime
    }
    var begin = appointTimeDate.dateTime+":00.000Z";
    var end;
   
    var x = Date.parse(appointTimeDate.dateTime+"Z");
    var y = appointTimeDate.appointmentLength * 60000 +(x);
    var t = new Date(y);
    end = t.toISOString();
    //console.log('The new time is: '+appointmentDetails);

    const appointmentDates = {
        appointmentStartTD: begin,
        appointmentEndTD: end
    }

   

    
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }
      
     


    try{
      
        await reqAddEvent(accessToken, appointmentDates, appointmentDetails);
        res.redirect("/appointments");
        

    }catch (e){
      console.log(e);
      console.log("Redirected to 404");
        res.redirect('/404');
    }
});

    async function reqAddEvent(accessToken, appointmentDates, appointmentDetails){
      
      try{
       
        var xm = " ";
        xm = await tgraph.getCalId(accessToken);
      
    }
        catch (err){
          console.log(err);
           console.log("ERROR: Couldnt get to getCalId()");
          }

          if(xm !== " "){

        try{
            var eventAdded = await graph.addEvent(accessToken, appointmentDates, appointmentDetails, xm);
            params.eventAdded = eventAdded.value;

            console.log(eventAdded.value);

        } 
        catch (err){
          console.log(err);
          console.log("ERROR: Couldnt get to getCalendarID()");
         }
        }
        else{
          console.log("there was an issue.")
        }
        
    };



    
module.exports = router;