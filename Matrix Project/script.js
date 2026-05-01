const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 18;
let columns, rows;
let grid = [];
let wordStreams = [];

let freezeTimer = 0;
let redGlitchTimer = 0;

let mouse = { x: -9999, y: -9999 };

const secretMessages = [
  "NEO","TRINITY","MORPHEUS","ZION","ORACLE",
  "MATRIX","REDPILL","BLUEPILL","AGENT",
  "SMITH","CHOICE","FREEWILL","DESTINY",
  "AWAKEN","RESIST","SYSTEM","CODE",
  "GLITCH","DEJA VU","SIMULATION",
  "THERE IS NO SPOON",
  "WELCOME TO THE REAL WORLD",
  "FOLLOW THE WHITE RABBIT",
  "THE ONE",
  "101","303","1999","777"
];

class Cell {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.baseX = col * fontSize;
    this.baseY = row * fontSize;
    this.x = this.baseX;
    this.y = this.baseY;

    this.value = Math.random() > 0.5 ? "1" : "0";
    this.brightness = Math.random();
    this.isBlank = false;

    this.overrideChar = null;
    this.overrideTimer = 0;
  }

  update(time) {

    if (freezeTimer <= 0 && !this.overrideChar && Math.random() > 0.985) {
      this.value = this.value === "1" ? "0" : "1";
    }

    if (Math.random() > 0.998) {
      this.isBlank = true;
      setTimeout(() => this.isBlank = false, 200 + Math.random() * 500);
    }

    if (Math.random() > 0.96) {
      this.brightness = Math.random();
    }

    const wave = Math.sin((this.baseX + time * 0.2) * 0.01);
    this.brightness += wave * 0.1;

    // Restore override automatically
    if (this.overrideTimer > 0) {
      this.overrideTimer--;
      if (this.overrideTimer <= 0) {
        this.overrideChar = null;
      }
    }

    // Mouse affect
    const dx = this.baseX - mouse.x;
    const dy = this.baseY - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      const force = (120 - dist) / 120;
      this.x = this.baseX + dx * force * 0.3;
      this.y = this.baseY + dy * force * 0.3;
      this.brightness = 1;
    } else {
      this.x = this.baseX;
      this.y = this.baseY;
    }
  }

  draw() {
    if (this.isBlank) return;

    let alpha = 0.2 + Math.max(0, Math.min(this.brightness, 1)) * 0.8;

    if (redGlitchTimer > 0) {
      ctx.fillStyle = `rgba(255,0,0,${alpha})`;
      ctx.shadowColor = "rgba(255,0,0,1)";
    } else {
      ctx.fillStyle = `rgba(0,255,70,${alpha})`;
      ctx.shadowColor = "rgba(0,255,70,1)";
    }

    ctx.shadowBlur = 6;

    const char = this.overrideChar || this.value;
    ctx.fillText(char, this.x, this.y);
  }
}

class WordStream {
  constructor(text = null, center = false) {
    this.text = text || secretMessages[Math.floor(Math.random() * secretMessages.length)];
    this.center = center;

    this.direction = Math.random() > 0.5 ? "horizontal" : "vertical";

    if (center) {
      this.direction = "horizontal";
      this.row = Math.floor(rows / 2);
      this.position = Math.floor(columns / 2 - this.text.length / 2);
      freezeTimer = 120;
    } else {
      if (this.direction === "horizontal") {
        this.row = Math.floor(Math.random() * rows);
        this.position = -this.text.length;
      } else {
        this.col = Math.floor(Math.random() * columns);
        this.position = -this.text.length;
      }
    }
    
    this.speed = 0.15;
  }

  update() {

    if (!this.center) this.position += this.speed;

    for (let i = 0; i < this.text.length; i++) {
      const index = Math.floor(this.position) - i;

      if (this.direction === "horizontal") {
        if (index >= 0 && index < columns) {
          const cell = grid[index][this.row];
          if (cell) {
            cell.overrideChar = this.text[this.text.length - 1 - i];
            cell.overrideTimer = 15;
          }
        }
      } else {
        if (index >= 0 && index < rows) {
          const cell = grid[this.col][index];
          if (cell) {
            cell.overrideChar = this.text[this.text.length - 1 - i];
            cell.overrideTimer = 15;
          }
        }
      }
    }

    if (!this.center &&
        this.position > (this.direction === "horizontal" ? columns : rows) + this.text.length) {
      return false;
    }

    return true;
  }
}

function createGrid() {
  grid = [];
  columns = Math.floor(canvas.width / fontSize);
  rows = Math.floor(canvas.height / fontSize);

  for (let col = 0; col < columns; col++) {
    grid[col] = [];
    for (let row = 0; row < rows; row++) {
      grid[col][row] = new Cell(col, row);
    }
  }
}

function animate(time = 0) {

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";

  if (freezeTimer > 0) freezeTimer--;
  if (redGlitchTimer > 0) redGlitchTimer--;

  for (let col of grid) {
    for (let cell of col) {
      cell.update(time);
      cell.draw();
    }
  }

  wordStreams = wordStreams.filter(stream => stream.update());

  // Increase frequency so all words appear
  if (Math.random() > 0.985) {
    wordStreams.push(new WordStream());
  }

  // Rare centered THE ONE event
  if (Math.random() > 0.9595 && freezeTimer === 0) {
    wordStreams.push(new WordStream("THE ONE", true));
  }

  // Rare red glitch
  if (Math.random() > 0.998) {
    redGlitchTimer = 4;
  }

  requestAnimationFrame(animate);
}

createGrid();
animate();

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createGrid();
});

