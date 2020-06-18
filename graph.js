var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
var calendarz = require('./routes/calendar');





module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
    
  },
 

  // <GetEventsSnippet>
  getEvents: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
      .api('/me/calendars')
      .select('id,name')
      .get();

    return events;
  },


  
  getOneEvents: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const id = calendarz.idofCalendar;
    const oneX = await client
      //.api('/me/calendars/'+id+'/calendarView?startDateTime=2020-06-08T23:59:00&endDateTime=2020-06-08T23:59:00')
      .api('/me/calendars/'+id+'/events')
      .select('subject,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return oneX;

  },

  
  getOneEventsOD: async function(accessToken, theDate) {
    const client = getAuthenticatedClient(accessToken);
    
    const date1 = await calendarz.theDate;
    const id = calendarz.idofCalendar;
    var log = console.log("_graph_api_response - Date: "+ date1);
    const oneXE = await client
    .api('/me/calendars/'+id+'/calendarview')
    .query({
      startdatetime : date1+"T00:00:00",
      enddatetime: date1+"T23:59:00"
    })
    .select('subject,start,end')
    .orderby('createdDateTime ASC')
    .get()
    .catch((err) => {
      console.log(err);
      
  });
    return oneXE;
  }
  


 
};



function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

