let scoreMD = 0;
let scoreAW = 0;

function addPointsMd(team, points){
  scoreMD += points; //adds points to the current score
  document.getElementById("scoreMd").textContent = scoreMD;
  
}

function addPointsAw(team, points){
  scoreAW += points; //adds points to the current score
  document.getElementById("scoreAw").textContent = scoreAW;
  
}

const clearMdBtn = document.getElementById("clearMd");
const clearAwBtn = document.getElementById("clearAw");

clearMdBtn.addEventListener("click", ()=>{
  scoreMD = 0;
  document.getElementById("scoreMd").textContent = scoreMD;
  
});

clearAwBtn.addEventListener("click", ()=>{
  scoreAW = 0;
  document.getElementById("scoreAw").textContent = scoreAW;
  
});

