var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
const app = require('../app');
const Moment = require('moment');
const MomentRange = require('moment-range');
const { request } = require('../app');
const moment = MomentRange.extendMoment(Moment);


var params;


router.get('/',
  async function (req, res) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
      params = {
        active: { appointments: true }
      };

      var accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);

        await fetchMembers(accessToken);
        
      } catch (err) {
        req.flash('message-alert', {
          type: 'danger',
          message: 'Could not get access token. Try signing out and signing in again.',
        });
        res.redirect('/appointments')
      }
    }
   

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
    req.flash('message_alert', {
      type: 'danger',
      message: 'Error: ' + error
    });
  }


}


let appointmentDetails = "";
let appointmentDates = "";


router.post('/getAppointmentDet', async (req, res) => {

  var accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('message-alert', {
          type: 'danger',
          message: 'Could not get access token. Try signing out and signing in again.',
        });
        res.redirect('/appointments')
      }


  let membersMail = '';
  if (members) {

    for (var i = 0; i < members.value.length; i++) {

      if (members.value[i].displayName == req.body.colleagues) {

        membersMail = members.value[i].userPrincipalName;
      }
    }
  }




  appointmentDetails = {
    scheduledBy: req.body.scheduledBy,
    scheduledFor: req.body.colleagues,
    colleaguesMail: membersMail,
    appointmentLength: req.body.appointmentLength,
    vodaStore: '45 William Street, Galway'
  }

  var timeFromForm = req.body.time;
  var HHMM = moment(timeFromForm, 'H:mm a').format("HH:mm");
  var theTimeDate = req.body.dateTime + "T" + HHMM;

  const appointTimeDate = {
    appointmentLength: req.body.appointmentLength,
    dateTime: theTimeDate
  }
  var begin = appointTimeDate.dateTime + ":00.000Z";
  var end;
  

  var x = Date.parse(appointTimeDate.dateTime + "Z");
  var y = appointTimeDate.appointmentLength * 60000 + (x);
  var t = new Date(y);
  end = t.toISOString();


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
  var busy = false;
  var appsConflict = [];


  try {
    const grupID = app.profile.storeID;
  
    const scheduleCheck = await graph.checkAvailability(accessToken, checkDate, grupID);
    params.scheduleCheck = scheduleCheck.value;

   

    for (var i = 0; i < params.scheduleCheck.length; i++) {

      var strt = params.scheduleCheck[i].start.dateTime.slice(0, 19);
      var en = params.scheduleCheck[i].end.dateTime.slice(0, 19);


      try {

        var colleguemailChecked = params.scheduleCheck[i].attendees[i].emailAddress.address;
        var collegueresponseChecked = params.scheduleCheck[i].attendees[i].status.response;

      } catch (error) {
        console.log(error);
      }


      var appBookTimeStrt = strt.slice(11, 16);
      var appBookTimeEn = en.slice(11, 16);

      appsConflict[i] = { times: appBookTimeStrt + " - " + appBookTimeEn };

      var date1 = [moment(strt), moment(en)];
      var date2 = [moment(checkDate.checkDateStart), moment(checkDate.checkDateEnd)];

      var range = moment.range(date1);
      var range2 = moment.range(date2);


      if (appointmentDetails.colleaguesMail == colleguemailChecked) {
        if (collegueresponseChecked == "accepted") {
          busy = true;
        }


        if (range.overlaps(range2)) {
          if ((range2.contains(range, true) || range.contains(range2, true)) && !date1[0].isSame(date2[0]))
            availability = true;
          else
            availability = false;
        }
      }
    }

    var returnDate = begin.slice(11, 16) + "-" + end.slice(11, 16) + " " + begin.slice(8, 10) + begin.slice(4, 8) + begin.slice(2, 4);
   


    checkedData = true;
    console.log(availability);

    params.availability = availability;
    params.busy = busy;
    params.appsConflict = appsConflict;
    params.checkedData = checkedData;
    params.appointmentDates = checkDate;
    params.displayDate = returnDate;
    params.appointmentDetails = appointmentDetails;


    // console.log(params);

    res.render('appointments', params);


    //scheduleCheck will check the view of events with in the parameters of which the event is to be scheduled,
    //this check must be done and sorted before executing the event creation and proposed to the user.  




  } catch (e) {
    console.log(e);
    console.log("Redirected to 404");
    res.redirect('/404');
  }






});



router.post('/getAppointmentDet/createAppointment', async (req, res) => {

  var accessToken;
  try {
    accessToken = await tokens.getAccessToken(req);
  } catch (err) {
    req.flash('message-alert', {
      type: 'danger',
      message: 'Could not get access token. Try signing out and signing in again.',
    });
    res.redirect('/appointments')
  }

  try {

    var isDataValid = true;
    if (req.body.firstName == "" || req.body.lastName == "" || req.body.phone == "") {
      isDataValid = false;
      throw 'Missing Data: First Name, Last Name & Phone number must be provided.'

    }


    var correctPhNum = await checkPhoneNum(req.body.phone);
    console.log(correctPhNum);
    if (correctPhNum == false) {
      isDataValid = false;
      throw 'Phone Number must have a valid prefix of 08X'
    }



    appointmentDetails["subject"] = "ONEXONE-" + req.body.firstName + " " + req.body.lastName;
    appointmentDetails["firstName"] = req.body.firstName;
    appointmentDetails["lastName"] = req.body.lastName;
    appointmentDetails["phone"] = req.body.phone;
    appointmentDetails["device"] = req.body.device;
    appointmentDetails["content"] = req.body.appNote;


    if (isDataValid == true) {
      console.log("i got here");
      await reqAddEvent(accessToken, appointmentDates, appointmentDetails);
      req.flash('message_alert', {
        type: "success",
        message: 'Appointment Successfully Booked, awaiting response.'
      });
      res.redirect("/appointments");
    }

    else {
      return

    }


  } catch (error) {
    req.flash('message_alert', {
      type: 'danger',
      message: 'Error: ' + error
    });
    res.redirect('/appointments');
    console.log("redirected");
  }

});


//Asynchronous function that takes valid parameters from where it is called and access token.
//This code adds an event to the calendar via an api call.
async function reqAddEvent(accessToken, appointmentDates, appointmentDetails) {

//initalizing group id for calendar in local variable.
  var groupID = app.profile.storeID;



//if there is a group id it will take the read in parameters and call graph.addEvent to execute the api call.
  try {
    if (groupID !== "") {
    var eventAdded = await graph.addEvent(accessToken, appointmentDates, appointmentDetails, groupID);
    params.eventAdded = eventAdded.value;
    }
    else{
      throw "Could not get 'groupID'";
    }


  }
  catch (error) {
    console.log(error);
    req.flash('message_alert', {
      type: 'danger',
      message: 'Error: ' + error
    });
  }
}





// Called to validate if a string is a valid irish mobile number.
async function checkPhoneNum(phNumber) {

 if (phNumber.length >= 10) {
    var staticPre = phNumber.slice(0, 2);
    staticPre = parseInt(staticPre);
    
    if (staticPre === 8) {
      var varPrefix = phNumber.slice(2, 3);
      varPrefix = parseInt(varPrefix);

      if ((varPrefix === 3) || (varPrefix === 5) || (varPrefix === 6) || (varPrefix === 7) || (varPrefix === 9)) {

        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}


module.exports = router;