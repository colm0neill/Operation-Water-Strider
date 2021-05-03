if(window.innerWidth <= 600){

  if(document.body.contains(document.getElementById('appointmentForm'))){
    
    document.getElementById("appointmentForm").scrollIntoView({behavior:"smooth"});

    if(navigator.userAgent.indexOf("Safari") != -1)
    {
      location.href = '#appointmentForm';
    }
} 
  
}

function showRelCollegues(type){

   

    var rem =[];
    var add =[];

   var employees = document.getElementById("colleagues");

    for(var i = 0; i< employees.length; i++){
        var x = employees.options[i].text;
        var str = x.includes(type);
      
        if(str == false){
            rem += i;
        }
        else(add+=i);
    }

   for(var i = 0; i<employees.length;i++){
       if(rem.includes(i)){
        var g = employees.options[i].style.display="none";
       }
       if(add.includes(i)){
        var h = employees.options[i].style.display="contents";
        
        var randomEmp = Math.floor(Math.random() * add.length);

        employees.options[add[randomEmp]].selected = true;
        
       }
       
   }
 

   
}

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

function setAppointmentTimeToNow(){


    var d = new Date();
    var x = document.getElementById("demo");
    var h = addZero(d.getUTCHours());
    var m = addZero(d.getUTCMinutes());


    var minuteQuarterPos = 0;
    var hourSeg = 0;

switch(true) {
    case (m < 16):
      minuteQuarterPos = 1;
      break;
      case (m < 31):
        minuteQuarterPos = 2;
      break;
      case (m < 46):
        
        minuteQuarterPos = 3;
      break;
    default:
        
        minuteQuarterPos = 4;
    break;      
}

var currentTimeSuggestion;

if((h>9)&&(h<18)){
   hourSeg =  h - 8; 
   currentTimeSuggestion = ((hourSeg *4) + minuteQuarterPos);
   document.getElementById('time').getElementsByTagName('option')[currentTimeSuggestion].selected = true;
}









}


window.onload=function(){
let todayDate = new Date().toISOString().substr(0,10);
document.querySelector("#dateTime").value = todayDate;

setAppointmentTimeToNow();



}




