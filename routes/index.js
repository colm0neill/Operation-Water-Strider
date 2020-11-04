// Licensed under the MIT License.

// <IndexRouterSnippet>
var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers.js');
const app = require('../app.js');




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

module.exports = router;
