document.addEventListener('DOMContentLoaded', function() {
    drawGraphs();
}, false);

async function drawGraphs() {
	const graphValues = await getGraphValues();
		
	//console.log("i got a fish");

	var ctx = document.getElementById('graph2').getContext('2d');
	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'bar',
	
		// The data for our dataset
		data: {
			labels: graphValues.hourViewTimes,
			datasets: [{
				backgroundColor: 'rgb(0, 0, 0)',
				borderColor: 'rgba(255, 255, 255,1)',
				data: graphValues.hourView
			}]
		},
	
		// Configuration options go here
		options: {
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 20,
					bottom: 10
				}
			},
			legend: {
				display: false,
			},
			gridLines: {
				display: false
			 },
			scales: {
				yAxes: [{
					
					ticks: {
						display:false,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					  }
					
				}],
				xAxes: [{
					barPercentage: 0.2,
					ticks: {
						display:false,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					  },
					  
				}]
			}
		}
	});



	var ctx = document.getElementById('graph1').getContext('2d');
	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',
	
		// The data for our dataset
		data: {
			labels: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
			datasets: [{
				borderJoinStyle:'round',
     			 borderCapStyle:'round',
				  lineTension:0,
				  borderWidth:5,
				  pointRadius:0,
				  pointHoverRadius: 5,
				backgroundColor: 'rgba(0, 0, 0,0)',
				borderColor: 'rgba(0, 0, 0,1)',
				data: graphValues.weekView
			}]
		},
	
		// Configuration options go here
		options: {
			layout: {
				padding: {
					left: 20,
					right: 30,
					top: 20,
					bottom: 0
				}
			},
			legend: {
				display: false,
			},
			gridLines: {
				display: false
			 },
			 tooltips:{
				 xPadding: 10,
			 },
			scales: {
				yAxes: [{
					
					ticks: {
						display:false,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					  }
					
				}],
				xAxes: [{
					ticks: {
						beginAtZero:false,
						display:false,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					  },
					  
				}]
			}
		}
	});





}


async function getGraphValues(){

	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		},
		
	};
	try {
		const response = await fetch('/calcGraphData');
		const graphValues = await response.json();
		//console.log(graphValues);
		return graphValues;
		
	}
	catch (err) {
		console.log(err);
		console.log("Error Occured: failed to get new events.")
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

