var express = require('express');
var router = express.Router();
var tokens = require('./tokens.js');
var graph = require('./graph.js');


module.exports = {
    getCalId:async function(accessToken) {
    var idofCalendar = '';
    
   

    var params = {
        active: { calendar: true }
      };


    if (accessToken && accessToken.length > 0) {
        try {
            // Get the events
            var calendars = await graph.getCalendars(accessToken);
            params.calendars = calendars.value;
            console.log(calendars.value);
        } catch (err) {
            req.flash('error_msg', {
                message: 'Could not fetch events',
                debug: JSON.stringify(err)
            });
        }
    } else {
        req.flash('error_msg', 'Could not get an access token');
    }


    for (var i = 0; i < calendars.value.length; i++) {
        if (calendars.value[i].name == 'ONE 2 ONE') {
            idofCalendar = calendars.value[i].id;
            //exports.idofCalendar = idofCalendar;
            console.log("id of Calendar"+ idofCalendar);
        }
    }
    if(idofCalendar == ''){
        var idofCal = await graph.createCalendar(accessToken);
        idofCalendar = idofCal.id;
        
    }

    return idofCalendar;
}


}