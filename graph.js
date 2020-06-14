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
      .api('/me/calendars/'+id+'/events')
      .select('subject,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return oneX;

  },

  
  getOneEventsOD: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);
    var log = console.log("i got in");
    const date1 = calendarz.theDate;
    const id = calendarz.idofCalendar;
    const oneXDay = await client
      //.api('/me/calendars/'+id+'/calendarview?startdatetime='+date1+'T00:00:00.861Z&enddatetime='+date1+'T23:59:59.861Z')
      .api('/me/calendars/'+id+'/calendarview?startdatetime=2020-06-08T00:00:00.861Z&enddatetime=2020-06-08T23:59:59.861Z')
      .select('subject,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return oneXDay;

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

