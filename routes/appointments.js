var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers');
const app = require('../app');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);


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



let members = '';

async function fetchMembers(accessToken) {
  const storeID = await app.profile.storeID;
  //console.log(storeID);

  try {

    members = await graph.getMembersInGroup(accessToken, storeID);
    params.members = members.value;
    //console.log(members);

  } catch (error) {
    console.log(error);
  }


}


let appointmentDetails = "";
let appointmentDates = "";


router.post('/getAppointmentDet', async (req, res) => {

  let membersMail = '';
  if (members) {

    for (var i = 0; i < members.value.length; i++) {

      if (members.value[i].displayName == req.body.colleagues) {

        membersMail = members.value[i].userPrincipalName;
      }
    }
  }




   appointmentDetails = {
    subject: "ONEXONE-" + req.body.firstName + " " + req.body.lastName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    device: req.body.device,
    content: req.body.appNote,
    scheduledBy: req.body.scheduledBy,
    scheduledFor: req.body.colleagues,
    colleaguesMail: membersMail,
    appointmentLength: req.body.appointmentLength,
    vodaStore: '45 William Street, Galway'

  }

  const appointTimeDate = {
    appointmentLength: req.body.appointmentLength,
    dateTime: req.body.dateTime
  }
  var begin = appointTimeDate.dateTime + ":00.000Z";
  var end;

  var x = Date.parse(appointTimeDate.dateTime + "Z");
  var y = appointTimeDate.appointmentLength * 60000 + (x);
  var t = new Date(y);
  end = t.toISOString();
  //console.log('The new time is: '+appointmentDetails);

  appointmentDates = {
    appointmentStartTD: begin,
    appointmentEndTD: end
  }

  var checkBegin = begin.slice(0, 19);
  var checkEnd = end.slice(0, 19);

  const checkDate = {
    checkDateStart: checkBegin,
    checkDateEnd: checkEnd
  }
var checkedData = false;
var availability = true;


  try {
    accessToken = await tokens.getAccessToken(req);
  } catch (err) {
    req.flash('error_msg', {
      message: 'Could not get access token. Try signing out and signing in again.',
      debug: JSON.stringify(err)
    });
  }


  try {
    const grupID = app.profile.storeID;

    const scheduleCheck = await graph.checkAvailability(accessToken, checkDate, grupID);
    params.scheduleCheck = scheduleCheck.value;
    
    for(var i = 0; i < params.scheduleCheck.length; i++){
      
    var strt = params.scheduleCheck[i].start.dateTime.slice(0, 19);
    var en = params.scheduleCheck[i].end.dateTime.slice(0, 19);

    var date1 = [moment(strt), moment(en)];
    var date2 = [moment(checkDate.checkDateStart), moment(checkDate.checkDateEnd)];

    var range  = moment.range(date1);
    var range2 = moment.range(date2);

    if(range.overlaps(range2)) {
      if((range2.contains(range, true) || range.contains(range2, true)) && !date1[0].isSame(date2[0]))
       availability = false;
    else
      availability = false;
  }

    }

    checkedData = true;

    params.availability = availability;
    params.checkedData = checkedData;
    params.appointmentDates = checkDate;
    params.appointmentDetails = appointmentDetails;


    console.log(params);
    
    res.render('appointments',params);
    
    
    //console.log("Availability for your appointment is: "+availability);
    
    //scheduleCheck will check the view of events with in the parameters of which the event is to be scheduled,
    //this check must be done and sorted before executing the event creation and proposed to the user.  




  } catch (e) {
    console.log(e);
    console.log("Redirected to 404");
    res.redirect('/404');
  }



    


});


router.post('/createAppointment', async (req, res) => {

  try {

    // await reqAddEvent(accessToken, appointmentDates, appointmentDetails);
    res.redirect("/appointments");
    //res.render('appointments', { name: 'Tobi' })


  } catch (e) {
    console.log(e);
    console.log("Redirected to 404");
    res.redirect('/404');
  }

  async function reqAddEvent(accessToken, appointmentDates, appointmentDetails) {

    try {

      var groupID = app.profile.storeID;


    }
    catch (err) {
      console.log(err);
      console.log("ERROR: Couldnt get to getCalId()");
    }

    if (groupID !== " ") {

      try {
        var eventAdded = await graph.addEvent(accessToken, appointmentDates, appointmentDetails, groupID);
        params.eventAdded = eventAdded.value;

        //console.log(eventAdded.value);

      }
      catch (err) {
        console.log(err);
        console.log("ERROR: Couldnt get to getCalendarID()");
      }
    }
    else {
      console.log("there was an issue.")
    }

  }
});




module.exports = router;