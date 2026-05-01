/*
const ctx = new AudioContext();
console.log(ctx);
function sound(){
  const osc = ctx.createOscillator(); 
  osc.type = //"sine"; 
             //"square"; 
             //"sawtooth"; 
             //"triangle";
 
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}
*/




const ctx = new (window.AudioContext || window.webkitAudioContext)();

const morse = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
  F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
  P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  1: ".----", 2: "..---", 3: "...--",
  4: "....-", 5: ".....", 6: "-....",
  7: "--...", 8: "---..", 9: "----.",
  0: "-----"
};

//example
const name = "peteraugros";

for(let letter of name){
  console.log(letter);
}

async function playMorse(){
  await ctx.resume(); 
  const text = document.getElementById("textInput").value.toUpperCase(); //get the user input (all uppercase)
  
  const dot = 0.1; //duration of the dot sound
  const dash = 0.3; //duration of the dash sound, 3x the dot
  const gap = 0.1; //duration of the SILENCE between symbols
  const letterGap = 0.3; //duration of the SILENCE between letters
  const wordGap = 0.7; //duration of the SILENCE between words

  let time = ctx.currentTime; //set the timer (0 to start) for scheduling sounds
  
  console.log("Here is the time: ",time);
  
  // for ... of ... new loop, takes the letter
  for(let char of text){
    
    //detects space between words in the user input, adds the correct time of silence and goes back to the loop
    if(char === " "){
      time += wordGap;
      continue;
    }

    //uses the current letter to get symbol from the "morse" object, returns the morse code symbol
    //so turns the current letter from the user to the correct morse code symbol
    const code = morse[char];
    
    //if nothing is found, go to next iteration of the loop
    if(!code) continue;
    
    
    //another for...of... loop, this time iterating through each part of the symbol and playing a sound for the dot or dash.
    for(let symbol of code){
      const osc = ctx.createOscillator(); //creates oscillator, or the instrument
      osc.type = "square"; //selects the sound
      osc.frequency.value = 600; //sets frequency
      osc.connect(ctx.destination); //connects to speakers
      osc.start(time); //play, at current time
      
      //if statement assinging correct duration to 
      if(symbol === "."){
        osc.stop(time + dot); //stop sound at current time plus correct duration
        time += dot; // update time to reflect the dot we just played
      } else {
        osc.stop(time + dash); //stop sound at current timpe plus correct duration
        time += dash; // update time to reflect the dash we just played
      }

      time += gap; // if not a dot or dash, insert silece for a space between symbols
    }

    time += letterGap; //inster silence for a space between letters
    
  }
}
