const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//create volume, connect to speaker, set default value to 0.3 (0-1)
const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);
masterGain.gain.value = 0.3;

//function to handle html slide
function setVolume(val){
  masterGain.gain.value = val;
}

//mario song in arrays, note and duration
const marioTheme = [

  // Intro
  ['E5',0.2],['E5',0.2],['E5',0.3],
  ['C5',0.2],['E5',0.3],['G5',0.6],
  ['G4',0.6],

  // Main Phrase
  ['C5',0.45],['G4',0.45],['E4',0.45],
  ['A4',0.3],['B4',0.3],['A4s',0.15],['A4',0.3],
  ['G4',0.2],['E5',0.2],['G5',0.2],['A5',0.3],
  ['F5',0.15],['G5',0.3],
  ['E5',0.3],['C5',0.15],['D5',0.15],['B4',0.45],

  // Repeat
  ['C5',0.45],['G4',0.45],['E4',0.45],
  ['A4',0.3],['B4',0.3],['A4s',0.15],['A4',0.3],
  ['G4',0.2],['E5',0.2],['G5',0.2],['A5',0.3],
  ['F5',0.15],['G5',0.3],
  ['E5',0.3],['C5',0.15],['D5',0.15],['B4',0.45],

  // Bridge
  ['G5',0.2],['F5s',0.2],['F5',0.2],['D5',0.2],['E5',0.4],
  ['G4',0.3],['A4',0.3],['G4',0.2],['A4',0.2],['C5',0.4],
  ['A4',0.3],['C5',0.3],['D5',0.6],

  ['G5',0.2],['F5s',0.2],['F5',0.2],['D5',0.2],['E5',0.4],
  ['C6',0.3],['C6',0.3],['C6',0.6],

  ['G5',0.2],['F5s',0.2],['F5',0.2],['D5',0.4],['E5',0.4],
  ['G4',0.3],['A4',0.3],['G4',0.2],['A4',0.2],['C5',0.4],
  ['A4',0.3],['C5',0.3],['D5',0.6],
  ['D5s',0.5],['D5',0.5],['C5',0.6],


  // Fast Run Section
  ['C5',0.2], ['C5',0.2],['C5',0.2],
  ['C5',0.4], ['C5',0.2],['D5',0.2], ['E5',0.2], ['C5',0.4], ['A4',0.2], ['G4',0.6],

  ['C5',0.2], ['C5',0.2], ['C5',0.2],['C5',0.2], ['C5',0.4], ['D5',0.2], ['E5',0.6],

  ['C5',0.2], ['C5',0.2],['C5',0.2],
  ['C5',0.4], ['C5',0.2],['D5',0.2], ['E5',0.2], ['C5',0.4], ['A4',0.2], ['G4',0.4],
  
  ['E5',0.2], ['E5',0.2], ['E5',0.2],['E5',0.2],
  ['C5',0.2], ['E5',0.3], ['G5',0.7],
  ['G4',0.6],
  

  // Ending
  ['E4',0.4],['G4',0.4],
  ['G4',0.2],['A4',0.2],['F5',0.2],['F5',0.2],['A4',0.4],
  ['B4',0.3],['A5',0.3],['A5',0.2],['A5',0.2],['G5',0.2],['F5',0.2],
  ['E5',0.3],['C5',0.3],['A4',0.3],['G4',0.6],

  ['C5',0.4],['G4',0.4],
  ['G4',0.2],['A4',0.2],['F5',0.2],['F5',0.2],['A4',0.4],
  ['B4',0.3],['F5',0.2],['F5',0.2],['F5',0.2],['E5',0.2],['D5',0.2],['C5',0.4],
  ['G4',0.4],['E4',0.4],['C4',0.6],

  ['C5',0.4],['G4',0.4],['E4',0.4],
  ['A4',0.3],['B4',0.3],['A4',0.4],
  ['G4s',0.3],['A4s',0.3],['G4s',0.4],
  ['G4',0.2],['F4s',0.2],['G4',0.6]
  
];

const notes = {
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, F3s:185.00,
  G3:196.00, A3:220.00, B3:246.94,

  C4:261.63, D4:293.66, D4s:311.13, E4:329.63,
  F4:349.23, F4s:369.99,
  G4:392.00, G4s:415.30,
  A4:440.00, A4s:466.16, B4:493.88,

  C5:523.25, D5:587.33, D5s:622.25, E5:659.25,
  F5:698.46, F5s:739.99,
  G5:783.99, G5s:830.61,
  A5:880.00, A5s:932.33, B5:987.77,
  C6:1046.50
}; 


//jump sound
function jump(){
  bounceCharacters(); //animates sprites
  const osc = audioCtx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(800,audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200,audioCtx.currentTime+0.1);
  osc.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime+0.15);
}

function bounceCharacters(){
  const mario = document.getElementById("mario");
  const luigi = document.getElementById("luigi");
  mario.classList.add("jump");
  luigi.classList.add("jump");

  setTimeout(()=>{
    mario.classList.remove("jump");
    luigi.classList.remove("jump");
  },300);
}
//forEach is a loop that takes items from a list and performs a function on EACH of them.
//lets see what forEach does
marioTheme.forEach(function(noteData) {
  console.log(noteData);
});

function playMario() {
  jump();

  let t = audioCtx.currentTime;

  marioTheme.forEach(function(noteData) {
    
    //setting each part into its own variable, like what we do with api info
    let note = noteData[0];   // first item in the array
    let dur  = noteData[1];   // second item in the array

    const osc = audioCtx.createOscillator();
    osc.type = "square";

    osc.frequency.value = notes[note];

    osc.connect(masterGain);

    osc.start(t);
    osc.stop(t + dur);

    t = t + dur;  // move time forward for next note
  });
}
/*
function playMario(){
  jump();
  let t = audioCtx.currentTime;
  marioTheme.forEach(([note,dur])=>{
    const osc = audioCtx.createOscillator();
    osc.type="square";
    osc.frequency.value = notes[note];
    osc.connect(masterGain);
    osc.start(t);
    osc.stop(t + dur);
    t += dur;
  });
}

*/

