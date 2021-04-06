var express = require('express');
var router = express.Router();
var tokens = require('./tokens.js');
var graph = require('./graph.js');
const { request } = require('./app.js');


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
        } catch {
            
            req.flash('message-alert',{ 
                type:'danger',
                message: 'Could not contact the graph to get Calendar'});
        }
    } else {
        req.flash('message-alert',{ 
        type:'danger',
        message: 'Could not get an access token'});
    }


    for (var i = 0; i < calendars.value.length; i++) {
        if (calendars.value[i].name == 'ONE 2 ONE') {
            idofCalendar = calendars.value[i].id;
            
        }
    }
    if(idofCalendar == ''){
        var idofCal = await graph.createCalendar(accessToken);
        idofCalendar = idofCal.id;
        
    }

    return idofCalendar;
},

getSortGroups: async function(accessToken){

    //Called from app.js when initializing the auth callback 
    //to pull in store and store group info and id's
    
    var params = {
        active: { index: true }
    };

    var storeGroup = '';
    
    //Checks accessToken presence and calls to graph to get all groups.
    if (accessToken && accessToken.length > 0) {
        try {
            var groupsInvolved = await graph.getMyGroups(accessToken);
            params.groupsInvolved = groupsInvolved.value;
           

        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        req.flash('error_msg', 'Could not get an access token');
    }


    //checks returned results for the correct store - staticly provided currently. 03/NOV/2020
    async function findStore(groupsInvolved){

      if(groupsInvolved !== undefined){

        for (var i = 0; i < groupsInvolved.value.length; i++) {
            if (groupsInvolved.value[i].displayName == 'GWS' || groupsInvolved.value[i].displayName == 'ATH') {
                
                storeGroup = groupsInvolved.value[i];

                
            }
            
        }
       

    }
    }

    await findStore(groupsInvolved);
    return storeGroup;


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
            
         
        }
        else{
            req.flash('message-alert',{
                type:'danger',
                message:'NoteBook name could not be found.'
            })
        }
    }
}
await derp(noteBooks);

    if(idofNotebook == ''){
      
        var idofNoteB = await graph.createNotebook(accessToken);
        idofNotebook = idofNoteB.id;
        
    }

    return idofNotebook;

}


}