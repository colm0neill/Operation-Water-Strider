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



/* GET /calendar */
// <GetRouteSnippet>
router.get('/', setDate,
  async function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {

      let params = {
        active: { calendar: true }
      };
      let accessToken;

      //console.log(app.profile)

      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }


      try {
        await getCalendarData(app.profile.calCurrentView, accessToken, params);
        params.date = app.profile.calCurrentView;
      }
      catch (error) {
        console.log(error)
      }


      //console.log(params.eventsMonth);
      res.render('calendar', params);



    }
  });






router.put('/updateDate', setDate, async (req, res,next) => {
  const data = req.body;
  //console.log("Server data = " + data.month + data.year);


  currentMonthStr = moment().month(data.month).format('MMMM');
  currentMonth = data.month;
  currentYear = data.year;

  app.profile['calCurrentView'] = {
    month: currentMonth,
    monthName: currentMonthStr,
    year: currentYear
  }

  if (req.body.month && req.body.year) {

    res.json({
      status: "success",
      month: data.month,
      year: data.year
    });

  } else {
    
    res.json({
      status: "failed",
      month: data.month,
      year: data.year
    });
  }
});









router.get('/getNxPrMonth', async (req, res) => {

  let params = {
    active: { calendar: true }
  };

  let accessToken;

  try {
    accessToken = await tokens.getAccessToken(req);
  } catch (err) {
    req.flash('error_msg', {
      message: 'Could not get access token. Try signing out and signing in again.',
      debug: JSON.stringify(err)
    });
  }

  try {
    
    await getCalendarData(app.profile.calCurrentView, accessToken, params)
    params.date = app.profile.calCurrentView;
  }
  catch (error) {
    console.log(error)
  }



  //console.log(params.eventsMonth);
  res.render('calendar', params);




  
});









async function setDate(req, res, next) {

 



if(!("calCurrentView" in app.profile)){
  //console.log('there is not calCurrentView in app.profile.');
  try {
    
     
      let currentMonthStr = moment().format('MMMM');
      let currentMonth = moment().month();
      let currentYear = moment().year();

      app.profile['calCurrentView'] = {
        month: currentMonth,
        monthName: currentMonthStr,
        year: currentYear
      }

     
        
  
  } catch (err) {
    console.log(err);
  }
}

  next();
  return
};





async function getCalendarData(calCurrentView, accessToken, params) {
  var month = calCurrentView.month;
  var year = calCurrentView.year;
  

  var startDate = '';

  if (year && month) {
    startDate = moment([year, month]);
  }
  else { startDate = moment([currentYear, currentMonth]) }

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






module.exports = router;