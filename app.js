var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
require('dotenv').config();

var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const tgraph = require('./graphTriggers.js');

var users = {};


passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});


const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});

async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }

  try{
    const user = await graph.getUserDetails(accessToken);
   
    const storeGroup = await tgraph.getSortGroups(accessToken);

    //console.log(storeGroup);
    
    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
      profile['givenName'] = user.givenName;
    }
    if (storeGroup) {
      // Add properties to profile
      profile['store'] = storeGroup.displayName;
      profile['storeID'] = storeGroup.id;
      profile['storeDes'] = storeGroup.description;
    }
    else{
      profile['store'] = "";
      profile['storeID'] = "";
      profile['storeDes'] = "";
    }

    exports.profile = profile;
  } catch (err) {
    return done(err);

    
  }

  //console.log(profile);


  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oauth2.accessToken.create(params);

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, oauthToken };
  return done(null, users[profile.oid]);  
}
// </SignInCompleteSnippet>



// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var graphTriggers = require('./graphTriggers');
var calendarRouter = require('./routes/calendar');
var notesRouter = require('./routes/notes');
var appointmentsRouter = require('./routes/appointments');
var graph = require('./graph');



var app = express();


app.use(session({
  secret: 'your_secret_value_here',
  resave: true,
  saveUninitialized: true,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function(req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');
  res.locals.message = req.flash('message_alert');


  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash('error');
  for (var i in errs){
    res.locals.error.push({message: 'An error occurred', debug: errs[i]});
  }

  
  next();
});
 
// </SessionSnippet>
var exphbs = require('express-handlebars');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'hbs');
app.use(express.static('images'));


// <FormatDateSnippet>
//var hbs = require('hbs');

var moment = require('moment');
const { profile } = require('console');
// Helper to format date/time sent by Graph
var hbs = exphbs.create({
  eventDateTime: function(dateTime) {
    return moment(dateTime).format('h:mm A');
  }
});
//hbs.registerPartials(__dirname +'/views/partials');

// </FormatDateSnippet>

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// <AddProfileSnippet>
app.use(function(req, res, next) {
  // Set the authenticated user in the
  // template locals
  if (req.user) {
    res.locals.user = req.user.profile;
  }
  next();
});
// </AddProfileSnippet>

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);
app.use('/notes', notesRouter);
app.use('/appointments', appointmentsRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
