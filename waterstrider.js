window.onload = function () {
	
	
	

var bk = document.getElementById("backgroundCurve");

var widthImg = window.innerWidth;
var heightImg = window.innerHeight;
console.log("Image Width is:"+widthImg+" Image Height is:"+ heightImg);

clock();
	
//----------------------Getting Time and Day-------------------//
function clock(){
  var d = new Date();
  var h = d.getHours();
  var n = d.getMinutes();
  var dd = d.getDay();
  var doW = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  if(n<10){  n= "0"+n;  }
  document.getElementById("dayTime").innerHTML = doW[dd]+"<br>"+h+":"+n;
  var t = setTimeout(clock, 500);
}
	
	
	
	
	
	
	
	
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

	console.log(dataPointsY);
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
			//ctxCir.style = '#fff';
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
		console.log("G2 "+g);
		dataPointsY2[i] = g;
	}

	console.log(dataPointsY2);
	for(i=0;i<7;i++){
		if((i != 0 )||(i !=9)){
			ctx2.beginPath();
			
			ctx2.moveTo((dataPointsX*i)+132,dataPointsY2[i]);
			ctx2.lineTo((dataPointsX*i+132),h2-20);
			ctx2.lineCap = "round";
			ctx2.lineWidth = 20;
			ctx.closePath();
			ctx2.stroke();
			
		console.log(i+" Y "+dataPointsY2[i]);
			}
	
		else{
			console.log("I equal's"+ i);
		}
	}
}

