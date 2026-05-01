
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TYPES = ["pill", "bacteria", "virus"];
const EMOJIS = { pill: "💊", bacteria: "🦠", virus: "🧬" };


class Entity {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 16;

    this.vx = (Math.random() - 0.5) * 2; // assigns random direction and speed (velocity)
    this.vy = (Math.random() - 0.5) * 2; // assigns random direction and speed (vleocity)
  }//end constructor

  move() {
    this.x += this.vx; // moves the entity according to the velocity (horizontal)
    this.y += this.vy; // moves the entity according to the velocity (vertical)
    
    //if x or y is less than 0 or greater than the canvas then change direction 
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1; 
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }//end move function

  //draws the emoji using fillText (like matrix project)
  draw() {
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(EMOJIS[this.type], this.x, this.y);
  }//end draw function

   //checks collisions
  checkCollision(other) {
    const dx = this.x - other.x; //horizontal distance between centers of the two circles
    const dy = this.y - other.y; //verticle distance between cennters of the two circles
    const distance = Math.sqrt(dx * dx + dy * dy); //using pathagorean theorem to find distance 
    return distance < this.radius * 2; //returning boolean true or false if the distance is less than 32 (in this case becasue radius is set at 16)
  }//end checkcollision function

  fight(other) {
    if (this.type === other.type) return; //if entity is the same, do nothing

    if (this.type === "pill" && other.type === "bacteria") other.type = "pill"; // pill beats baceria (other becomes pill)
    else if (this.type === "bacteria" && other.type === "virus") other.type = "bacteria"; // bacteria beats virus (other becomes bacteria)
    else if (this.type === "virus" && other.type === "pill") other.type = "virus"; // virus beats pill (other becomes virus)
    else this.type = other.type; 
  }//end fight function
}//end class

let entities = [];
let gameOver = false;

function init() {
  entities = [];
  gameOver = false;
  document.getElementById("outcome").style.display = "none";
  
  //this for loop populates the "entities" array with 150 objects each complete with their own x, y data, and share all the methods attached
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const type = TYPES[Math.floor(Math.random() * 3)];
    entities.push(new Entity(x, y, type));
  }
}

function update() {
  if (gameOver) return; //if game over is true, update stops

  entities.forEach(e => e.move()); //looping through the entities array, and calling the "move" method on each of them

  //then we loop through each one entitiy in the array and call the check collision function, and if there is a collision they fight using the fight method, both are part of the object, defined in the class
  
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) { //j = i + 1 stops any entitiy from checking against itself or the same pair twice, but still that is 11,175 checks, ×60 frames per second which is ≈ 670,500 checks per second, this program runs about 6.5 million operations per second which is 0.00217 (or .217%) of the computer's full power.
      if (entities[i].checkCollision(entities[j])) {
        entities[i].fight(entities[j]);
      }
    }
  }

  updateCounters(); //updates counters
  checkEndgame(); //checks if win conditions are met
  
}//end update function

//calls the draw function for each of the objects 60 times per second
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //this clears a rectangle of whatever size you want, parameters = (x,y,width, height)
  entities.forEach(e => e.draw()); //"e" is the instance variable holding the current item from the entities array, and then its draw() function is called drawing with new 
}

//calls the update and draw functions and 
function animate() {
  update(); //move the entities, check collisions, update counters.
  draw(); //redraws the entities after all the changes and checks
  requestAnimationFrame(animate); //repeat until win condition is met (2/3 entity count = 0)
}

function updateCounters() {
  const counts = { pill: 0, bacteria: 0, virus: 0 }; //object holding counters
  entities.forEach(e => counts[e.type]++); //looping through each entity to get its identity, using the identity to use as index in counts array, then incrementing, and update DOM.
  document.getElementById("pillCount").textContent = counts.pill; 
  document.getElementById("bacteriaCount").textContent = counts.bacteria;  //update DOM
  document.getElementById("virusCount").textContent = counts.virus;
}

function checkEndgame() {

  // Count how many of each type exist
  var pillCount = 0;
  var bacteriaCount = 0;
  var virusCount = 0;

  for (var i = 0; i < entities.length; i++) {
    if (entities[i].type === "pill") {
      pillCount++;
    } else if (entities[i].type === "bacteria") {
      bacteriaCount++;
    } else if (entities[i].type === "virus") {
      virusCount++;
    }
  }

  // Count how many types are zero
  var zeroTypes = 0;

  if (pillCount === 0) zeroTypes++;
  if (bacteriaCount === 0) zeroTypes++;
  if (virusCount === 0) zeroTypes++;

  // If two types are zero, game over
  if (zeroTypes >= 2) {
    gameOver = true;

    var outcome = document.getElementById("outcome");
    outcome.style.display = "block";

    if (bacteriaCount > 0) {
      outcome.textContent = "🦠 You are sick!";
    } else if (virusCount > 0) {
      outcome.textContent = "🧬 You died!";
    } else {
      outcome.textContent = "💊 You are healthy!";
    }
  }
}

// Reset simulation on click
canvas.addEventListener("click", init);

init(); //initial set up
animate(); //tipping the first domino
