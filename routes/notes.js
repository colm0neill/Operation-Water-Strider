var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers.js');
const app = require('../app.js');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const puppeteer = require('puppeteer');
const fs = require('fs');
var path = require('path');
const hbs = require('handlebars');
const { TIMEOUT } = require('dns');
const { dirname } = require('path');
const { set } = require('../app.js');




function checkAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    // Redirect unauthenticated requests to home page
    res.redirect('/')
    console.log("oops looks like you not authenticated.")
  } else {
    next()
  }
}



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
        });
      }



      res.render('notes', params);
    }
  });



router.post('/create', checkAuth, async (req, res, next) => {

  var theCode = req.body;

  var cfg = {};

  var converter = new QuillDeltaToHtmlConverter(theCode.ops, cfg);

  var html = converter.convert();

  var url = req.protocol + "://" + req.headers.host;
  console.log(url);

  var pdf = await createNewPDF(html, url);
  console.log("PDF Status: ", pdf);


  const src = fs.createReadStream('./resources/createdPDF/ONEXONE' + dateID + '.pdf');
  var ok2del = false;
  if (pdf == "done") {

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ONEXONE.pdf',
      'Content-Transfer-Encoding': 'Binary'
    });
    ok2del = true;
    src.pipe(res);
    setTimeout(deletePDF, 1000, ok2del);
  }

  function deletePDF(ok2del) {
    try {
      if (ok2del == true) {
        fs.unlinkSync('./resources/createdPDF/ONEXONE' + dateID + '.pdf');

        console.log("PDF: File sent & deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  }

});

const compile = async function (quilldata) {
  const html = fs.readFileSync('./resources/ONEXONEtemplate.hbs', 'utf-8');

  return hbs.compile(html)(quilldata)
}

async function createNewPDF(htmlContentQuill, url) {

  try {
    const data = {
      givenName: app.profile.givenName,
      quillData: htmlContentQuill,
      logo: url + '/images/tjwgHead.png'
    }


    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
    const page = await browser.newPage();

    const content = await compile(data);

    await page.setContent(content);
    await page.emulateMediaType('screen');
    await page.pdf({
      path: './resources/createdPDF/ONEXONE' + dateID + '.pdf',
      format: 'A4',
      margin: {
        top: 120,
        bottom: 80,
        left: 90,
        right: 90,
      },

      printBackground: true,
      waitUntil: 'networkidle2'
    });
    await browser.close();

    console.log("PDF Generation: compiled")
    return 'done';
  } catch (e) {
    console.log('Error', e);
    return e;
  }
}

var newDate = new Date();

const dateID = newDate.getTime();


module.exports = router;