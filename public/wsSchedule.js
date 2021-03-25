window.onload = function () { drawCalendar(); }




function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();

}

var date = new Date();
var month = null;
var year = null;
var monthNeg = 0;
var monthPos = 0;





async function drawCalendar() {

	//Setting date from id of html elment that is set server side.
	var yearMonth = document.getElementsByClassName('yearMonth')[0].id;
	month = yearMonth.slice(0, (yearMonth.length - 4));
	year = yearMonth.slice((yearMonth.length - 4), yearMonth.length);
	//console.log("month is :" + month + " Year is: " + year);
	month = parseInt(month, 10);
	year = parseInt(year, 10);

	// if the date is still null then set it using built in functions.
	if ((month == null) && (year == null)) {
		month = date.getMonth();
		year = date.getFullYear();
	}


	var today = date.getDate();
	var thisMonth = date.getMonth();
	var month2 = null;
	var thisYear = date.getFullYear();
	var dayStart = new Date(year + "-" + (month + 1) + "-01").getDay();

	if (month <= 8) {
		month2 = "0" + (month + 1);
	}
	else { month2 = month + 1; }


	var monthDays = daysInMonth((month + 1), year);
	var writeDays = document.getElementById("dayz");

	if (dayStart == 0) {
		dayStart = dayStart + 7;
	}

	var totalDayBoxes;

	totalDayBoxes = (monthDays - 1) + dayStart;

	for (i = 0; i < totalDayBoxes; i++) {
		if (thisMonth < 10) {

		}
		var dateid = '';
		var day = ((i + 2) - dayStart);
		if(day< 10) {
		
		dateid= "0"+day+ '-' + (month2) + '-' + year;
		}
		else{dateid = day+ '-' + (month2) + '-' + year;}




		if (i < (dayStart - 1)) {
			var x = document.createElement("li");
			writeDays.appendChild(x);
		}
		else {
			var x = document.createElement("li");

			x.innerHTML = (i + 2) - dayStart;
			x.setAttribute('class', 'dateB');
			x.setAttribute('value', (i + 2) - dayStart);
			x.setAttribute('id', "a" + dateid);
			x.setAttribute('onclick', 'getTodayView(this.id)');
			writeDays.appendChild(x);
		}
	}

	await assignTd(thisYear, thisMonth, month2, today, dayStart);
	
	}


async function assignTd(thisYear, thisMonth, thisMonth2, today, dayStart) {
	

	//console.log("today is: "+today);

	if ((thisYear == year) && (thisMonth == month)) {
		var y = document.getElementById("dayz");
		var x = y.getElementsByTagName('li')[((today + dayStart - 2))];
		x.setAttribute("class", "active");
	}

	var todayIs = '';
	if(today< 10) {
		
		todayIs = "0"+today+ '-' + (thisMonth2) + '-' + year;
		}
		else{ todayIs = today+ '-' + (thisMonth2) + '-' + year;}

	
		

	await getTodayView(todayIs);
}


function monthPrev() {
	if (month < 1) {
		month = 12;
		year = year - 1;
		monthNeg = 0;
	}
	month = month - 1;
	monthNeg--;

	removeCalendar();
	getNewMonth(month, year);
	drawCalendar();

}

function monthNext() {

	if (month > 10) {
		month = -1;
		year = year + 1;
		monthPos = 0;
	}

	month = month + 1;
	monthPos++;


	removeCalendar();
	getNewMonth(month, year);
	drawCalendar();

}

function removeCalendar() {
	var r = document.getElementById("dayz");
	while (r.firstChild) {
		r.removeChild(r.firstChild);
	}
}

var selectedDate;



async function getTodayView(date) {
	

	var e = document.getElementById("todayList").children.length;

	//console.log("Date Clicked"+date);


	for (var i = 0; i < e; i++) {

		var listId = document.getElementById("todayList").children[i].id;
		var listDate = document.getElementById(listId).getAttribute("name");


		var result = date.includes(listDate);
		
		if (result == true) {
			document.getElementById(listId).style.display = "contents";

		}
		if (result == false) {
			document.getElementById(listId).style.display = "none";

		}

	}


}

async function getNewMonth(month, year) {

	const data = { month, year };

	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	};
	try {
		const response = await fetch('calendar/updateDate', options);
		const result = await response.json();
		console.log("Information Update:" );
		console.log(result.status);
		if(result.status=="success"){
			getNewMonthData();
		}
		
	}
	catch (err) {
		console.log(err);
		console.log("Error Occured: failed to get new events.")
	}
	// try {
	// 	console.log("Reload is about to occur");
	// 	location.reload();

		
	// }
	// catch (err) {
	// 	console.log(err);
	// 	console.log("Error Occured: failed to reload page.");

	// }


}

async function getNewMonthData() {
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	};
	try {
		const response = await fetch('calendar/getNxPrMonth', options);
		
	} catch (error) {
		console.log(error);
	}
	try {
		console.log("Reload is about to occur");
		location.reload();

		
	}
	catch (err) {
		console.log(err);
		console.log("Error Occured: failed to reload page.");

	}
}