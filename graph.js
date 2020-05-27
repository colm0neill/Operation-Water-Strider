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
console.log("fuck a duck"+id);
    const oneX = await client
      .api('/me/calendars/'+id+'/events')
      .select('subject,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return oneX;

  }

 
};

/*

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
  },
 

  // <GetEventsSnippet>
  getOneEvents: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    

    const oneX = await client
      .api('/me/calendar/{id}')
      .select('id,name')
      .get();

    return eventsOneXOne;

  }
  // </GetEventsSnippet>

 
};


}
*/

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

