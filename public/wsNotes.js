var x;
var minutesG;
var secondsG;


var editor = new Quill('#editor', {
    modules: { 
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
    },
    theme: 'snow'
  });


function startTimer() {
    var timeSegVal = document.getElementById("timeSegment").value;

    document.getElementById("timeSegment").style.display = "none";
    document.getElementById("timeDigits").style.display = "initial";

    document.querySelector(".startTimer").style.display = "none";
    document.querySelector(".pauseTimer").style.display = "initial";


    var selectedTime;
    var selectedSeconds;
    var initialValue;

    if ((minutesG == 0) && (secondsG == 0) || (minutesG == undefined) && (secondsG == undefined)) {
        var selectedMinutes = timeSegVal;
        var selectedSeconds = 0;
        initialValue = "00:00";
        console.log("set Initial time");
    }
    else {
        selectedMinutes = minutesG;
        selectedSeconds = secondsG;
        initialValue = minutesG + ":" + secondsG;
    }

    document.getElementById("timeDigits").innerHTML = initialValue;

    runTimer(selectedMinutes, selectedSeconds, initialValue);

}


function runTimer(minutesP, secondsP) {

    var minutes = minutesP;
    var seconds = secondsP;

    var minutesString;
    var secondsString;

    x = setInterval(timer, 1000);

    function timer() {

        if (minutes < 10) {
            var minTrue = true;
        }
        if (seconds < 10) {
            var secTrue = true;
        }


        switch (minTrue) {
            case true:
                minutesString = "0" + (minutes.toString());
                break;
            default:
                minutesString = minutes.toString();
        }

        switch (secTrue) {
            case true:
                secondsString = "0" + (seconds.toString());
                break;
            default:
                secondsString = seconds.toString();
        }

        if ((minutes == 0) && (seconds == 0)) {
            stopTimer();
            alert("Timer: your time is up.");
        }

        else if (seconds == 0) {
            document.getElementById("timeDigits").innerHTML = minutesString + ":" + secondsString;
            seconds = 59;
            minutes--;
        } else {

            document.getElementById("timeDigits").innerHTML = minutesString + ":" + secondsString;


            seconds--;

            minutesG = minutes;
            secondsG = seconds;
        }
    }
}

function clearTimer() {
    clearInterval(x);
}

function stopTimer() {
    document.getElementById("timeDigits").innerHTML = "00:00";
    
    minutesG = 0;
    secondsG = 0;

    clearTimer();

    document.getElementById("timeDigits").style.display = "none";
    document.getElementById("timeSegment").style.display = "initial";

    document.querySelector(".pauseTimer").style.display = "none";
    document.querySelector(".startTimer").style.display = "initial";
}


function pauseTimer() {
    clearTimer();

    document.querySelector(".pauseTimer").style.display = "none";
    document.querySelector(".startTimer").style.display = "initial";
}