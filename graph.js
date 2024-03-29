var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const calendarz = require('./graphTriggers');





module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
    
  },
 

  // <GetEventsSnippet>
  getCalendars: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const calendars = await client
      .api('/me/calendars')
      .select('id,name')
      .get();

    return calendars;
    
  },

  getMyGroups: async function(accessToken){
    const client = getAuthenticatedClient(accessToken);
   
    const getallGroups = await client
        .api('/me/transitiveMemberOf')
        .select('displayName, id, description')
        .get()

        return getallGroups;
        
  },

  getMembersInGroup: async function(accessToken, storeID){
    const client = getAuthenticatedClient(accessToken);
    

    let membersList = await client
      .api('/groups/'+storeID+'/members')
      .select('displayName, userPrincipalName, jobTitle, id')
      .get();

     return membersList;

      
  },

  checkAvailability: async function(accessToken, checkDate, grupID){
    const client = getAuthenticatedClient(accessToken);
    

    const scheduleCheck = await client
    .api('/groups/'+grupID+'/calendarView?startDateTime='+checkDate.checkDateStart+'-00:00&endDateTime='+checkDate.checkDateEnd+'-00:00')
    .select('start, end, attendees')
    .get();

    return scheduleCheck;
  },





  
  getEventsMonthView: async function(accessToken, startOfMonth, endOfMonth, storeGroupID) {
    const client = getAuthenticatedClient(accessToken);
   
    const events = await client
      .api('/groups/'+storeGroupID+'/calendarView?startDateTime='+startOfMonth+'T00:00:00&endDateTime='+endOfMonth+'T23:59:00&$top=1000')
      //.api('/me//'+id+'/events')
      .select('webLink,subject,body,start,end,attendees')
      .orderby('createdDateTime DESC')
      .get();
      
    return events;
    
  },

  
  getOneEventsOD: async function(accessToken, theDate, idofCalendar) {
    const client = getAuthenticatedClient(accessToken);
    
    const date1 = theDate;
    const id = idofCalendar;
    
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
  },


  addEvent: async function(accessToken, appointmentDates, appointmentDetails, groupID) {
    const client = getAuthenticatedClient(accessToken);
    

    const id = calendarz.idofCalendar;

 
     const event2 = {
  subject: appointmentDetails.subject,
  start: {
      dateTime: appointmentDates.appointmentStartTD,
      timeZone: "UTC"
  },
  end: {
      dateTime: appointmentDates.appointmentEndTD,
      timeZone: "UTC"
  },
  attendees: [
    {
      "emailAddress": {
        "address":appointmentDetails.colleaguesMail,
        "name": appointmentDetails.scheduledFor
      },
      "type": "required"
    }
  ],
  body: {
    contentType: "html",
    content: "<div><b>Store:</b> "+appointmentDetails.vodaStore+"<br><b>Scheduled For:</b> "+appointmentDetails.scheduledFor
    +"<br><b>Scheduled By:</b> "+appointmentDetails.scheduledBy
    +"</div><br>"+"<div><b>First Name:</b> "+ appointmentDetails.firstName +"<br><b>Last Name:</b> "+ 
    appointmentDetails.lastName +"<br><b>Phone Number:</b> "+ appointmentDetails.phone +"<br> </div><br><b>Device:</b> "+appointmentDetails.device+"<br><br><b>Notes:</b> "+ 
    appointmentDetails.content
  }
  
};



   const eventAdded = await client
    .api('/groups/'+groupID+'/events')
    .post(event2)
    .catch((err) => {
      console.log("Error from added event.");
      console.log(err);
    
  });
    return eventAdded;
  },



  getNotebooks:async function(accessToken){
  
    const client = getAuthenticatedClient(accessToken);


    const notebooksCurrent = await client
    .api('/me/onenote/notebooks')
    .select('displayName,id')
    .get()
    .catch((err) => {
      console.log("Error in getNotebooks");
      console.log(err);
      
  });
  return notebooksCurrent;
  },


  createNotebook: async function(accessToken){
    const client = getAuthenticatedClient(accessToken);

    const oneNoteb = {
      displayName: "ONE 2 ONE"
    };
    

    const createNoteb = await client
      .api('/me/onenote/notebooks')
      .select('id,displayName')
      .post(oneNoteb);

  return createNoteb;
  },

  getStatsWeekView: async function(storeGroupID, startOfWeek, endOfWeek, accessToken) {
    const client = getAuthenticatedClient(accessToken);
   
    const eventsThisWeek = await client
      .api('/groups/'+storeGroupID+'/calendarView?startDateTime='+startOfWeek+'T00:00:00&endDateTime='+endOfWeek+'T23:59:00&$top=1000')
      //.api('/me//'+id+'/events')
      .select('start,end')
      .orderby('createdDateTime DESC')
      .get();
      
    return eventsThisWeek;
    
  },






  addNote: async function(accessToken, note ,noteBookID){
    const client = getAuthenticatedClient(accessToken);

   

    // const noteToAdd = await client
    //   .api('/me/onenote/notebooks/'+noteBookID+'/Events')
    //   .select('id,name')
    //   .post(oneNoteb);

  //return noteToAdd;

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

