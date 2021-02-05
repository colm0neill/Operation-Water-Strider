var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var fs = require('fs');
const tgraph = require('../graphTriggers');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const app = require('../app');
const { param } = require('./index.js');
const { response } = require('express');


var idofCalendar = '';
var theDate;
var accessToken;
let params = {
  active: { calendar: true }
};
let currentMonth = undefined;
let currentMonthStr = undefined;
let currentYear = undefined;

/* GET /calendar */
// <GetRouteSnippet>
router.get('/',
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {


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

      await setDate();
      
//console.log(params.eventsMonth);
      res.render('calendar', params);


      
    }
  });




async function setDate() {
  
//console.log("current month is:"+ currentMonth);


try{
  if ((currentMonth == undefined)&&(currentYear == undefined)) {

    currentMonthStr = moment().format('MMMM');
    currentMonth = moment().month();
    currentYear = moment().year();

    //console.log("current month is:"+ currentMonth);
 
  }
  
}catch(err){console.log(err);}
   
await getCalendarData(currentMonth, currentYear);

   params.date = {
    month:currentMonth,
    monthName: currentMonthStr,
    year: currentYear
   }
   //console.log("current month is:"+ currentMonth);
   //console.log(params.date);
};





async function getCalendarData(month, year) {


  var startDate = '';

  if(year && month){
    startDate = moment([year, month]);
  }
  else{startDate = moment([currentYear, currentMonth])}

  let startOfMonth = '';
  let endOfMonth = '';

  

    startOfMonth = moment(startDate).startOf('month').format('YYYY-MM-DD');
    endOfMonth = moment(startDate).endOf('month').format('YYYY-MM-DD');
   

  const storeGroupID = app.profile.storeID;
 
  //console.log("Start Of Month" + startOfMonth);
  if (accessToken && accessToken.length > 0) {

    try {

      if (storeGroupID) {

        const eventsMonth = await graph.getEventsMonthView(accessToken, startOfMonth, endOfMonth, storeGroupID);
        params.eventsMonth = eventsMonth.value;
        //console.log(params.eventsMonth);
      }
    } catch (err) {
    console.log(err)
    }
  } else {
    //req.flash('error_msg', 'Could not get an access token');
  }



  //-----------Removing irrelevant events to user.----------------
  //console.log(params.eventsMonth.length);
  for (var i = 0; i < params.eventsMonth.length; i++) {
    // console.log(params.eventsMonth[i].attendees[0].emailAddress.address);
    try {

      if (params.eventsMonth[i].attendees[0].emailAddress.address !== app.profile.email) {
        //console.log("------------ deleting -------------");
        delete params.eventsMonth[i];
      }
      else {
        var date = params.eventsMonth[i].start.dateTime.slice(8, 10) + params.eventsMonth[i].start.dateTime.slice(4, 8) + params.eventsMonth[i].start.dateTime.slice(0, 4);
        params.eventsMonth[i].displayDate = date;
        var time = params.eventsMonth[i].start.dateTime.slice(11, 16) + " - " + params.eventsMonth[i].end.dateTime.slice(11, 16);

        var bodyL = params.eventsMonth[i].body.content.length;
        var bodyString = params.eventsMonth[i].body.content;
        var dBody = bodyString.slice(148, (bodyL - 20));
       
        params.eventsMonth[i].displayTime = time;
        params.eventsMonth[i].id = i;
        params.eventsMonth[i].displayBody = dBody;
        delete params.eventsMonth[i].body;
        
        //console.log(params.eventsMonth[i]);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}

router.post('/getNewMonthView', async (req, res) => {
  const data = req.body;
  //console.log("Server data = " + data.month + data.year);

  
  currentMonthStr = moment().month(data.month).format('MMMM');
  currentMonth = data.month;
  currentYear = data.year;

  params.date = {
    month:currentMonth,
    monthName: currentMonthStr,
    year: currentYear
   }

  //console.log(params.date)

  await setDate();
  
  
   res.send(params)
});









async function processDate(accessToken, theDate) {
  var z = await theDate;



  //console.log("Server is requesting events for: " + z);


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


}


module.exports = router;