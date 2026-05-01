const countdownDate = new Date("April 27, 2026 23:59:59").getTime();

const minute = 1000 * 60; //milliseconds in one minute
const hour = 1000 * 60 * 60; //milliseconds in one hour
const day = 1000 * 60 * 60 * 24; //milliseconds in one day

//console.log("Number of milliseconds in one minute:", minute);
//console.log("Number of milliseconds in one hour:", hour);  
//console.log("Number milliseconds in one day:", day); 
 
const x = setInterval(() => {
  const now = new Date().getTime();
  
  //time left between birthday and now (in milliseconds)
  const distance = countdownDate - now;
  
  //calculate the number of days and round down, console.log, and DOM print
  const days = Math.floor(distance / day);
  console.log("Days: ", days);
  document.getElementById("days").innerText = days;
  
  //calculate the number of hours and round down, console.log, and DOM print 
  const hours = Math.floor((distance % day) / hour);
  console.log("Hours: ", hours);
  document.getElementById("hours").innerText = hours;
    
  //calculate the number of minutes and round down, console.log, and DOM print
  const minutes = Math.floor((distance % hour) / minute);
  console.log("Minutes", minutes);
  document.getElementById("minutes").innerText = minutes
    
  //calculate the number of minutes and round down, console.log, and DOM print
  const seconds =  Math.floor((distance % minute) / 1000);
  console.log("Seconds", seconds);
  document.getElementById("seconds").innerText = seconds;
  
  //end countdown when the distance between birthday and now is 0
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "Expired!";
  }
}, 1000);
