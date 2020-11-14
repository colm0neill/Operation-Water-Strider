var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers');
const app = require('../app');

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

      accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }
    }
    await fetchMembers(accessToken);

    res.render('appointments', params);
});



let members ='';

async function fetchMembers(accessToken){
  const storeID = await app.profile.storeID;
  //console.log(storeID);

  try{

   members = await graph.getMembersInGroup(accessToken, storeID);
    params.members = members.value;
  //console.log(members);
  
  } catch (error){
    console.log(error);  
  }
  

}





router.post('/getAppointmentDet', async (req, res) =>{

  let membersMail = '';
  if (members) {

    for (var i = 0; i < members.value.length; i++) {

      if (members.value[i].displayName == req.body.colleagues) {
        
        membersMail = members.value[i].userPrincipalName;
      }
    }
  }

  


    const appointmentDetails = {
        subject: "ONEXONE-"+req.body.firstName+" "+req.body.lastName,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        phone: req.body.phone,
        device : req.body.device,
        content: req.body.appNote,
        scheduledBy: req.body.scheduledBy,
        scheduledFor: req.body.colleagues,
        colleaguesMail: membersMail,
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

    var checkBegin =  begin.slice(0, 19);
    var checkEnd =  end.slice(0, 19);

    const checkDate = {
      checkDateStart: checkBegin,
      checkDateEnd: checkEnd
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
      const grupID = app.profile.storeID;

      const scheduleCheck = await graph.checkAvailability(accessToken, checkDate, grupID);
      
      console.log("This is what was returned from available req")
      console.log(scheduleCheck);

      //scheduleCheck will check the view of events with in the parameters of which the event is to be scheduled,
      //this check must be done and sorted before executing the event creation and proposed to the user.  

      


    }catch (e){
    console.log(e);
    console.log("Redirected to 404");
      res.redirect('/404');
  }



    try{
        
       // await reqAddEvent(accessToken, appointmentDates, appointmentDetails);
        res.redirect("/appointments");
        //res.render('appointments', { name: 'Tobi' })
        

    }catch (e){
      console.log(e);
      console.log("Redirected to 404");
        res.redirect('/404');
    }
});

    async function reqAddEvent(accessToken, appointmentDates, appointmentDetails){
      
      try{
       
        var groupID = app.profile.storeID;
        
         
    }
        catch (err){
          console.log(err);
           console.log("ERROR: Couldnt get to getCalId()");
          }

          if(groupID !== " "){

        try{
            var eventAdded = await graph.addEvent(accessToken, appointmentDates, appointmentDetails, groupID);
            params.eventAdded = eventAdded.value;

            //console.log(eventAdded.value);

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