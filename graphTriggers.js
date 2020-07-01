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
            //console.log(calendars.value);
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
            //console.log("id of Calendar"+ idofCalendar);
        }
    }
    if(idofCalendar == ''){
        var idofCal = await graph.createCalendar(accessToken);
        idofCalendar = idofCal.id;
        
    }

    return idofCalendar;
},




getNoteId: async function(accessToken) {
    var idofNotebook = '';


    var params = {
        active: { notes: true }
      };


    
      if (accessToken && accessToken.length > 0) {
        try {
            // Get the events
            var noteBooks = await graph.getNotebooks(accessToken);
            params.noteBooks = noteBooks.value;
            console.log(noteBooks.value);
        } catch (err) {
            req.flash('error_msg', {
                message: 'Could not fetch events',
               debug: JSON.stringify(err)
           });
        }
    } else {
        req.flash('error_msg', 'Could not get an access token');
    }

   async function derp(noteBooks){
      
    for (var i = 0; i < noteBooks.value.length; i++) {
        if (noteBooks.value[i].displayName == 'ONE 2 ONE') {
            idofNotebook = noteBooks.value[i].id;
            
            console.log("id of Note Book is: "+ idofNotebook);
        }
        else{console.log('got no heart tom!');}
    }
}
await derp(noteBooks);
console.log('Note id: '+idofNotebook);
    if(idofNotebook == ''){
        console.log("i run second");
        var idofNoteB = await graph.createNotebook(accessToken);
        idofNotebook = idofNoteB.id;
        
    }

    return idofNotebook;

}


}