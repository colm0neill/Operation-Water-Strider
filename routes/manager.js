var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
const app = require('../app');
const Moment = require('moment');
const MomentRange = require('moment-range');
const { request } = require('../app');
const { getUserDetails } = require('../graph.js');
const moment = MomentRange.extendMoment(Moment);



router.get('/',
  async function (req, res) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      req.flash('message-alert', {
        type: 'danger',
        message: 'User Not Authenticated',
      });
      res.redirect('/')
    } else {
      params = {
        active: { managerPortal: true }
      };

      //Get access token to contact ms graph.
      var accessToken;

      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('message-alert', {
          type: 'danger',
          message: 'Could not get access token. Try signing out and signing in again.',
        });
        res.redirect('/')
      }





      //Validating job position. Returing home if not a manager.

      try {
        if (app.profile.jobTitle == "Device Doctor") //to be changed to manager after development.
        {
          params.manager = true;
          console.log('you are the device doctor');



          let employees = await fetchEmployees(accessToken);
          params.employees = employees;
        }
        else {
          //console.log('you are not the manager')
          throw 'Nice try, you are not the manager... :P';
        }
      }
      catch (error) {
        req.flash('message-alert', {
          type: 'danger',
          message: 'this is an error'
        });
         
      }




      

      res.render('manager', params);
    }
   
  });



router.post('/createTrainingModule', async (req, res) => {

  let trainingModule = {
    name: req.body.trainingName,
    blurb: req.body.blurb,
    assignedTo: req.body.assignTo,
    importance: req.body.importance
  }

  console.log(trainingModule);


  req.flash('message_alert', {
    type: 'success',
    message: 'Success: Training Module Added.'
  });
  res.redirect('/manager');
});






async function fetchEmployees(accessToken,) {
  const storeID = await app.profile.storeID;
  //console.log(storeID);

  let employees;

  try {

    let staff = await graph.getMembersInGroup(accessToken, storeID);
    employees = staff.value;

    for (var i = 0; i < employees.length; i++) {
      //console.log('looping '+ staff[i].jobTitle +' VS '+ app.profile.jobTitle)
      if (employees[i].jobTitle == app.profile.jobTitle) {
        console.log('true statement')
        delete employees[i];

      }
    }
    // console.log(employees)
    return employees;

  } catch (error) {
    console.log(error);
    req.flash('message_alert', {
      type: 'danger',
      message: 'Error: ' + error
    });
  }


}







module.exports = router;