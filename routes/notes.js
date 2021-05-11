var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');
var tgraph = require('../graphTriggers.js');
const app = require('../app.js');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');
const pdf = require("pdf-creator-node");




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

  var pdfMake = await createNewPDF(html, url);
  console.log("PDF Status: ", pdfMake);

  const srcPath = path.join(__dirname, '..','resources','createdPDF','ONEXONE' + dateID + '.pdf');

  const src = fs.createReadStream(srcPath);
  
  console.log('Source File Path: ', srcPath);
  var ok2del = false;
  if (pdfMake == "done") {

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
        fs.unlinkSync(srcPath);

        console.log("PDF: File sent & deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  }

});




const compile = async function (quilldata) {
  const fileCompile = path.join(__dirname, '..', 'resources', 'ONEXONEtemplate.hbs');
  const html = fs.readFileSync(fileCompile, 'utf-8');
  console.log('Compile File Path: ', fileCompile);
  return hbs.compile(html)(quilldata)
}



async function createNewPDF(htmlContentQuill, url) {

  try {

    var options = {
      format: "A4",
      orientation: "portrait",
      border: "20mm",
      header: {
          height: "5mm"
      },
      footer: {
          height: "14mm",
          contents: {
              first: 'Page: 1',
              default: '<span style="color: #444;">Page: {{page}}</span>', // fallback value
          }
      }
  };

    const data = {
      givenName: app.profile.givenName,
      quillData: htmlContentQuill,
      logo: url + '/images/tjwgHead.png'
    }

    const content = await compile(data);
    const savePath = path.join(__dirname, '..','resources','createdPDF','ONEXONE'+dateID+'.pdf');
    var document = {
      html: content,
      data: {
       
      },
      path: savePath,
      type: "",
    };

    try{
      await pdf.create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
    } 
    catch(e){
      console.log('Error Occured when generating pdf',e);
    }

    // const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
    // const page = await browser.newPage();

    

    // await page.setContent(content);
    // await page.emulateMediaType('screen');
    // await page.pdf({
    //   path: './resources/createdPDF/ONEXONE' + dateID + '.pdf',
    //   format: 'A4',
    //   margin: {
    //     top: 120,
    //     bottom: 80,
    //     left: 90,
    //     right: 90,
    //   },

    //   printBackground: true,
    //   waitUntil: 'networkidle2'
    // });
    // await browser.close();

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