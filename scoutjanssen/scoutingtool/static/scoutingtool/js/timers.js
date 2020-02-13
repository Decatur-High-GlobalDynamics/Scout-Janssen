//I apologize for the layoutsvjhfsdjbvfdshjbvfdsbkhjrbesjkvbfdjsngvuieryskjvufhdbsjherugskbjvhdfhkbfsdhjvbfdjh
//rgyuvwreshjchuuskbvierbfurebvuireskvbuskbchwagucjsabyfjhvabiuersbfkjhbdshjkvbdfsjvjhfsbvjkergyfuhbjksvcudkjsbvhjkdfbvsukrejhsgbdfhjskvbsjherbgkudfbsvhjbrehskvhfgyudshjbreskuvhfuskuvbersjhvuibersjbfjhkdsvbdfjhsvbjhbsdfhjvbvfhdjskbvfjdhskbvdfjksbvjhdsfkheruiskbvjfdhb
  onkeydown = function(e){
    /*
    Q: 81
    W: 87
    E: 69
    R: 82
    T: 84
    */
    if(document.activeElement.tagName != "INPUT"){

      doTheTimerStuff(e.which);
      shortcut(e.which);
    }
  }
  onkeyup = function(e){
    if(document.activeElement.tagName != "INPUT") doTheOtherTimerStuff(e.which);
  }

  function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }

  //Perfectly ordered variables
  var timerFor0 = 0;
  var timer0Loop;
  var timerFor4 = 0;
  var timer4Loop;
  var timer3Loop;
  var timerFor3 = 0;
  var timer2Loop;
  var timerFor2 = 0;
  var timer1Loop;
  var timerFor1 = 0;
  function timeChange(){
    //console.log("Time change");
  }


  function doTheTimerStuff(keyCode){
    timeInterval = 10;
    timeIncrements = timeInterval/1000;
    switch(keyCode){
      case 49:
        if(timer0Loop != undefined){
          clearInterval(timer0Loop);
          timer0Loop = undefined;
        } else {
          clearInterval(timer4Loop);
          timer4Loop = undefined;
          var timerElement = document.getElementById("timer0");
          timer0Loop = setInterval(function(){
            timerFor0 = timerFor0 + timeIncrements;
            timerElement.innerHTML = (timerFor0 / 1).toFixed(2);
            timeChange();
           }, timeInterval);
        }
        break;
      case 51:
        timer1Div = document.getElementById("timer1");
        if(timer1Loop == undefined) timer1Loop = setInterval(function(){
          timerFor1 = timerFor1 + timeIncrements;
          timer1Div.innerHTML = (timerFor1 / 1).toFixed(2);
          timeChange();

        }, timeInterval);
        break;
      case 52:
        timer2Div = document.getElementById("timer2");
        if(timer2Loop == undefined) timer2Loop = setInterval(function(){
          timerFor2 = timerFor2 + timeIncrements;
          timer2Div.innerHTML = (timerFor2 / 1).toFixed(2);
          timeChange();
        }, timeInterval);
        break;
      case 53:
        timer3Div = document.getElementById("timer3");
        if(timer3Loop == undefined) timer3Loop = setInterval(function(){
          timerFor3 = timerFor3 + timeIncrements;
          timer3Div.innerHTML = (timerFor3 / 1).toFixed(2);
        }, timeInterval);
        break;
      case 50:
        if(timer4Loop != undefined){
          clearInterval(timer4Loop);
          timer4Loop = undefined;
        } else {
          clearInterval(timer0Loop);
          timer0Loop = undefined;
          var timerElement4 = document.getElementById("timer4");
          timer4Loop = setInterval(function(){
            timerFor4 = timerFor4 + timeIncrements;
            timerElement4.innerHTML = (timerFor4 / 1).toFixed(2);
          }, timeInterval);
        }
        break;
    }
  }

  function doTheOtherTimerStuff(keyCode){
    switch(keyCode){
      case 51:
        clearInterval(timer1Loop);
        timer1Loop = undefined;
        break;
      case 52:
        clearInterval(timer2Loop);
        timer2Loop = undefined;
        break;
      case 53:
        clearInterval(timer3Loop);
        timer3Loop = undefined;
        break;
    }
  }

/*if(document.activeElement){
  if(document.activeElement.tagName != "input"){
    console.log("Input not selected")
    timer()
  }
  else{
    console.log("input selected")
  }
}
else{
  timer()
}*/
setInterval(function(){for(var i = 0; i < 5; i++){document.getElementById("timer" + i).value = document.getElementById("timer" + i).innerText; document.getElementById("tiempo" + i).innerText = document.getElementById("timer" + i).innerText;}}, 100);

function fixTheStuff(){
  for(var i = 0; i < 5; i++){
    if(document.getElementById("timer" + i).value == ""){
      document.getElementById("timer" + i).value = "0.0";
    }
  }
}
