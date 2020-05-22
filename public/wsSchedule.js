window.onload = function() {drawCalendar();}




function daysInMonth (month, year) { 
	return new Date(year, month, 0).getDate(); 

} 

var date = new Date(); 
var month = null; 
var year = null;
var monthNeg = 0;
var monthPos = 0;

function drawCalendar() {
	
	if((month == null)&&(year == null)){
	month = date.getMonth(); 
	year = date.getFullYear();
	}
	
	
	var today = date.getDate() ;
	var thisMonth = date.getMonth();
    var thisYear = date.getFullYear();
    console.log('month: '+month);
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
		else {
		var x = document.createElement("li");
		
        x.innerHTML = (i+2)-dayStart;
        x.setAttribute('class',"dateB");
        x.setAttribute('value', (i+2)-dayStart);
        x.setAttribute('onclick', 'getTodayView(this.value)');
		writeDays.appendChild(x);
		}
	}

	var x = setTimeout(assignTd(thisYear, thisMonth, today, dayStart), 4000);
}


function assignTd(tY, tM, tD, dS){
	var thisYear = tY;
	var thisMonth = tM;
	var today = tD;
	var dayStart = dS;

	if((thisYear == year)&&(thisMonth == month)){
	var y = document.getElementById("dayz");
	var x = y.getElementsByTagName('li')[((today+dayStart-2))];
	x.setAttribute("class", "active"); 
	}

}


function monthPrev(){
	if (month < 1){
		month = 12;
		year = year -1;
		monthNeg= 0;
	}
	month = month -1;
	monthNeg--;
	removeCalendar();
	drawCalendar();
}

function monthNext(){
	if (month > 10){
		month = -1;
		year = year +1;
		monthPos= 0;
	}
	
	month = month +1;
	monthPos++;
	removeCalendar();
	drawCalendar();

}

function removeCalendar(){
	var r = document.getElementById("dayz");
	while( r.firstChild ){
		r.removeChild( r.firstChild );
	  }
}

var selectedDate;

function getTodayView(value){

    selectedDate = value;

	console.log(selectedDate);
	localStorage.setItem("vOneLocalStorage", selectedDate);  
}

