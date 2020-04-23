window.onload = function () {
	
	
	var c = document.getElementById("graph1");
	var ctx = c.getContext("2d");
	
	var w = c.width;
	var h = c.height;
	var dataPointsX = w/6;
	console.log(w+" + "+h);
	
var gradient = ctx.createLinearGradient(0, 0, 170, 0);
gradient.addColorStop("0", "magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");

	var array = [3 , 6, 2, 56, 32, 5, 130];
var largest= 0;
 var dataPointsY = [];

for (i=0; i<=largest;i++){
    if (array[i]>largest) {
        var largest=array[i];
    }
}
for(i=0;i<7;i++){
var t = largest /100;
var g = Math.round(h-(array[i]/t));
dataPointsY[i] = g;
}

console.log(dataPointsY);
	
for(i=0;i<7;i++){
	
ctx.moveTo(dataPointsX*i,dataPointsY[i]);
console.log("Move 2 = "+dataPointsY[i]+" + "+ dataPointsX*i);

ctx.lineTo(dataPointsX*(i+1),dataPointsY[i+1]);
console.log("line 2 = "+dataPointsY[i+1]+" + "+ dataPointsX*(i+1));
ctx.strokeStyle = gradient;
ctx.lineWidth = 5;
ctx.stroke();
}
}