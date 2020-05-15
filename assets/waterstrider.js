window.onload = function () {
	
	
	

var bk = document.getElementById("backgroundCurve");

var widthImg = window.innerWidth;
var heightImg = window.innerHeight;
	
	
var c = document.getElementById("graph1");
var ctx = c.getContext("2d");
var ctxCir = c.getContext("2d");
ctx.scale(1,1);
	
var w = c.width;
var h = c.height;

var dataPointsX = w/6.5;
var array = [100 , 10, 20, 40, 60, 80, 100, 30];
var largest= 0;
var dataPointsY = [];

	for (i=0; i<=largest;i++){
		if (array[i]>largest) {
			var largest=array[i];
		}
	}
	
	for(i=0;i<7;i++){
		var t = largest /100;
		var g = Math.round(h-((array[i]/t)*5.5));
		
		dataPointsY[i] = g;
	}

	
	for(i=0;i<9;i++){
		if((i != 0 )||(i !=9)){
			ctx.beginPath();
			ctx.translate(.5,.5);
			ctx.moveTo((dataPointsX*i)+20,dataPointsY[i]);
			ctx.lineTo((dataPointsX*(i+1)+20),dataPointsY[i+1]);
			ctx.lineCap = "round";
			ctx.lineWidth = 10;
			ctx.closePath();
			ctx.stroke();
			
			
			ctxCir.beginPath();
			ctxCir.linewidth= 1;
			ctxCir.arc((dataPointsX*i)+20,dataPointsY[i],10,0*Math.PI,1.5*Math.PI);
			ctx.closePath();
			ctxCir.stroke();
			
			}
	
		else{
			console.log("I equal's"+ i);
		}
	}
	
var d = document.getElementById("graph2");
var ctx2 = d.getContext("2d");
ctx2.scale(1,1);
	
var w2 = d.width;
var h2 = d.height;

var dataPointsX2 = w2/8;
var array2 = [100 , 10, 20, 40, 60, 80, 100, 30];
var largest2= 0;
var dataPointsY2 = [];

	for (i=0; i<=largest2;i++){
		if (array2[i]>largest2) {
			var largest2=array2[i];
		}
	}
	
	for(i=0;i<7;i++){
		var t = largest2 /100;
		var g = Math.round(h2-((array2[i]/t)*4));
		dataPointsY2[i] = g;
	}

	
	for(i=0;i<7;i++){
		if((i != 0 )||(i !=9)){
			ctx2.beginPath();
			
			ctx2.moveTo((dataPointsX*i)+132,dataPointsY2[i]);
			ctx2.lineTo((dataPointsX*i+132),h2-20);
			ctx2.lineCap = "round";
			ctx2.lineWidth = 20;
			ctx.closePath();
			ctx2.stroke();
			
		
			}
	
		else{
			console.log("I equal's"+ i);
		}
	}
}


//----------------------Getting Time and Day-------------------//

window.onload = function() {runClock();}

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];



function runClock(){
	
	var d = new Date();
	var h = d.getHours();
	var n = d.getMinutes();
	var dd = d.getDay();
	var doW = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
	if(n<10){  n= "0"+n;  }
	document.getElementById("dayTime").innerHTML = doW[dd]+"<br>"+h+":"+n;
	var t = setTimeout(runClock, 1000);
  }
	
//-----------------------------END-----------------------------//	
	
//----------------------Generating Calendar -------------------//

window.onload = function() {drawCalendar();}



function daysInMonth (month, year) { 
	return new Date(year, month, 0).getDate(); 

} 

var date = new Date(); 
var month = ""; 
var year = "";
var monthCount = 0;

function drawCalendar() {
	
	if((month == "")&&(year == "")){
	month = date.getMonth(); 
	year = date.getFullYear();
	console.log("If null true");
	}
	
	var today = date.getDate();
	var dayStart = new Date(year + "-" + (month +1)+ "-01").getDay();
	
	var getDateBox = document.getElementById("yearMonth");
	getDateBox.innerHTML= months[month];

	b = document.createElement("br");
	m = document.createElement("span");
	m.setAttribute("style","font-size:18px");
	m.innerHTML=year;
	getDateBox.appendChild(b);
	getDateBox.appendChild(m);


	var monthDays= daysInMonth(month,year);
	var writeDays = document.getElementById("dayz");
	
	var totalDayBoxes = monthDays + dayStart;
	
  
	

	for(i = 0; i< totalDayBoxes; i++){
		if(i<(dayStart-1)){
			var x = document.createElement("li");
			writeDays.appendChild(x);
		}
		else{
		var x = document.createElement("li");
		
		x.innerHTML = (i+2)-dayStart;
		writeDays.appendChild(x);
		}
	}

	var y = document.getElementById("dayz");
	var x = y.childNodes[(today+dayStart)-1];
	x.setAttribute("class", "active"); 

}


function monthPrev(){
	console.log("Prev foo");
	month = date.getMonth() - 1; 
	year = date.getFullYear() - 1;
	removeCalendar();
	drawCalendar();
	monthCount--;
	

}

function monthNext(){
	console.log("Next foo");
	month = date.getMonth() + 1; 
	year = date.getFullYear() + 1;
	removeCalendar();
	drawCalendar();
	monthCount++;

}

function removeCalendar(){
	var r = document.getElementById("dayz");
	while( r.firstChild ){
		r.removeChild( r.firstChild );
	  }
}