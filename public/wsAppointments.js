

function showRelCollegues(type){

   

    var rem =[];
    var add =[];

   var employees = document.getElementById("colleagues");

    for(var i = 0; i< employees.length; i++){
        var x = employees.options[i].text;
        var str = x.includes(type);
       // console.log("compare "+x+" to "+type);
       // console.log(str);
        if(str == false){
           // console.log("its false");
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
        
        employees.options[add[0]].selected = true;
        
       }
       
   }
 

   
}




window.onload=function(){
let todayDate = new Date().toISOString().substr(0,10);
document.querySelector("#dateTime").value = todayDate;





}




