var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
var calendarz = require('./routes/calendar');





module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
    
  },


  
  getOneEventsOD: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);
    
    const date1 = calendarz.theDate;
    const id = calendarz.idofCalendar;
    var log = console.log("_graph_api_response - Date: "+ date1 );
    const one = await client
    .api('/me/calendars/'+id+'/calendarview')
    .query({
      startdatetime : date1+"T00:00:00",
      enddatetime: date1+"T23:59:00"
    })
    .select('subject,start,end')
    .orderby('createdDateTime ASC')
    .get();

    return one;
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

