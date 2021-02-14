// Licensed under the MIT License.

// <IndexRouterSnippet>
var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers.js');
const app = require('../app.js');
const { response } = require('express');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);



/* GET home page. */
router.get('/', function (req, res, next) {
  let params = {
    active: { home: true }
  };



  res.render('index', params);
});


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
        })
      }



    }

  });




router.get('/calcGraphData', async (req, res) => {
  if (!req.isAuthenticated()) {
    // Redirect unauthenticated requests to home page
    res.redirect('/')
  } else {

    let params = {}
    const accessToken = await tokens.getAccessToken(req);
    //call api request to get range of data for statistics.

    const today = moment();
    let startOfWeek = today.startOf("isoWeek").format("YYYY-MM-DD");
    let endOfWeek = today.endOf("isoWeek").format("YYYY-MM-DD");;

    //startOfWeek = moment(startOfWeek).add(1,"days").format("YYYY-MM-DD");
    //endOfWeek = moment(endOfWeek).add(1,"days").format("YYYY-MM-DD");

   // console.log("start and end of week");
   // console.log(startOfWeek);
   // console.log(endOfWeek);
    const storeGroupID = await app.profile.storeID;

    const weekView = await graph.getStatsWeekView(storeGroupID, startOfWeek, endOfWeek, accessToken);
    params.weekView = weekView.value;

    //Sort returned events into an array of number of appointments per day.
    let returnWeekStats = [0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < params.weekView.length; i++) {
      let eventSDate = params.weekView[i].start.dateTime;
      eventSDate = eventSDate.slice(0, 10);
      for (var x = 0; x < 7; x++) {
        let compareDate = moment(startOfWeek).add(x, "days").format("YYYY-MM-DD");
        if (eventSDate == compareDate) {
          returnWeekStats[x]++;
        }
      }
    }

    let returnHoursForStats = ["", "", "", "", ""];
    let returnHourStats = [0, 0, 0, 0, 0];

    let twoDay = moment();
    twoDay = moment(twoDay).format("YYYY-MM-DD");

    let time = moment().format("HH:mm");

    time = (time.slice(0, 2)) - 2;

    for (var i = 0; i < 5; i++) {
      let h = parseInt(time, 10) + i;
      if (h > 23) {
        h = 0;
      }
      returnHoursForStats[i] = h.toString() + ":00";
    }
    //console.log(returnHoursForStats);

    time = time + "00";

    time = parseInt(time, 10);


    //console.log("today is: ")
    //console.log(time);
    //console.log(params.weekView.length);

    for (var i = 0; i < params.weekView.length; i++) {
      let eventTDate = params.weekView[i].start.dateTime;
      eventTDate = eventTDate.slice(0, 10);
      if (eventTDate == twoDay) {

        let eventSTime = params.weekView[i].start.dateTime;
        eventSTime = eventSTime.slice(11, 13) + "00";

        eventSTime = parseInt(eventSTime, 10);
        

        for (var x = 0; x < 5; x++) {
          let aTime = ((x * 100) + time);
          let bTime = (((x + 1) * 100) + time);
          if ((eventSTime >= aTime) && (eventSTime <= bTime)) {
            //console.log(eventSTime);
            returnHourStats[x]++;
          }

        }
      }
    }

      params.graphValues = {
        weekView: returnWeekStats,
        hourView: returnHourStats,
        hourViewTimes: returnHoursForStats
      }

      res.json(params.graphValues);
    }

  });

module.exports = router;
