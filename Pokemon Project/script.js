let pokemon1, pokemon2;
let currentTurn = "player";
let battleLocked = false;

// ===== ROUND & SCORE TRACKERS =====
let round = 1;
let playerWins = 0;
let computerWins = 0;
const maxRounds = 5;

// ===== FETCH RAW POKÉMON DATA =====
async function fetchPokemonData(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) throw new Error("Pokémon not found");

    const data = await res.json();
    return {
      name: data.name,
      health: data.stats.find(s => s.stat.name === "hp").base_stat,
      attack: data.stats.find(s => s.stat.name === "attack").base_stat,
      sprite: data.sprites.front_default
    };
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}

// ===== NORMALIZE STATS =====
function normalizePokemon(data) {
  return {
    name: data.name,
    maxHealth: Math.floor(data.health * 1.5),
    health: Math.floor(data.health * 1.5),
    attack: Math.floor(data.attack / 3),
    sprite: data.sprite
  };
}

// ===== DAMAGE ALGORITHM =====
function calculateDamage(attacker) {
  const variance = 0.8 + Math.random() * 0.4;
  return Math.floor(attacker.attack * variance);
}

// ===== CREATE GAME POKÉMON =====
function createPokemon(data) {
  const p = normalizePokemon(data);
  return {
    ...p,
    hit(target) {
      const dmg = calculateDamage(this);
      target.health = Math.max(0, target.health - dmg);
      return dmg;
    }
  };
}

// ===== DOM =====
const btn = document.getElementById("go");
const char1 = document.getElementById("char1");
const char2 = document.getElementById("char2");
const searchDiv = document.getElementById("search");

const playerSprite = $("#player-sprite");
const monsterSprite = $("#monster-sprite");

const smallPlayerSprite = document.getElementById("player-sprite2");
const smallMonsterSprite = document.getElementById("monster-sprite2");

const attackBtn = document.getElementById("attack-btn");

const playerNameDiv = document.getElementById("player-name");
const monsterNameDiv = document.getElementById("monster-name");

const playerHealthSpan = document.getElementById("player-health");
const monsterHealthSpan = document.getElementById("monster-health");

const logDiv = document.getElementById("log");
const centerDiv = document.getElementById("center-card");

// ===== POPULATE DROPDOWNS =====
async function populatePokemonDropdowns() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
  const data = await res.json();

  data.results.forEach(pokemon => {
    char1.add(new Option(pokemon.name.toUpperCase(), pokemon.name));
    char2.add(new Option(pokemon.name.toUpperCase(), pokemon.name));
  });
}

// ===== LOG =====
function log(text) {
  logDiv.innerHTML += `<p>${text}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

// ===== UPDATE UI =====
function updateUI() {
  playerHealthSpan.textContent = pokemon1.health;
  monsterHealthSpan.textContent = pokemon2.health;
}

// ===== ANIMATIONS =====
function animateAttack(attacker, defender, attackerImg, defenderImg, callback) {
  attackerImg
    .animate({ top: "-=30px" }, 200)
    .animate({ top: "+=30px" }, 200, () => {
      const dmg = attacker.hit(defender);

      updateUI();
      log(`${attacker.name.toUpperCase()} hits for ${dmg}!`);

      defenderImg
        .animate({ left: "-=10px" }, 80)
        .animate({ left: "+=20px" }, 80)
        .animate({ left: "-=10px" }, 80, callback);
    });
}

// ===== BOUNCE & FADE FUNCTIONS =====
function bounceAndFadeLoser(loserImg) {
  loserImg.show().css("position", "relative");

  let bounces = 3;
  function bounce(count) {
    if (count === 0) {
      loserImg.fadeOut(800);
      return;
    }
    loserImg.animate({ top: "-=30px" }, 150)
            .animate({ top: "+=30px" }, 150, () => bounce(count - 1));
  }
  bounce(bounces);
}

function bounceAndFadePokemon(winner) {
  let winnerImg, loserImg;

  if (winner === "player") {
    winnerImg = playerSprite;
    loserImg = monsterSprite;
  } else if (winner === "computer") {
    winnerImg = monsterSprite;
    loserImg = playerSprite;
  } else return;

  winnerImg.show().css("position", "relative");
  loserImg.show().css("position", "relative");

  let bounces = 3;
  function bounce(count) {
    if (count === 0) {
      winnerImg.fadeOut(800);
      loserImg.fadeOut(800);
      return;
    }
    winnerImg.animate({ top: "-=30px" }, 150)
             .animate({ top: "+=30px" }, 150, () => bounce(count - 1));
  }
  bounce(bounces);
}

// ===== ROUND WIN HANDLER =====
function handleRoundEnd(winner) {
  let loserImg;

  if (winner === "player") {
    playerWins++;
    log("Round " + round + ": You win this round!");
    loserImg = monsterSprite;
  } else {
    computerWins++;
    log("Round " + round + ": Computer wins this round!");
    loserImg = playerSprite;
  }

  if ((pokemon1.health <= 0 || pokemon2.health <= 0) && round <= maxRounds) {
    bounceAndFadeLoser(loserImg);
  }

  log(`Score → You: ${playerWins} | Computer: ${computerWins}`);
  round++;

  if (round > maxRounds) {
    if (playerWins > computerWins) {
      log("🏆 YOU ARE THE CHAMPION! 🏆");
      bounceAndFadePokemon("player");
    } else if (computerWins > playerWins) {
      log("💀 COMPUTER WINS THE MATCH! 💀");
      bounceAndFadePokemon("computer");
    } else {
      log("🤝 IT'S A TIE!");
      playerSprite.fadeOut(800);
      monsterSprite.fadeOut(800);
    }

    round = 1;
    playerWins = 0;
    computerWins = 0;
    setPlayAgainMode();
  } else {
    setPlayAgainMode();
  }
}

// ===== TURN HANDLER =====
function battleTurn() {
  if (battleLocked) return;
  battleLocked = true;

  if (pokemon1.health <= 0 || pokemon2.health <= 0) {
    battleLocked = false;
    return;
  }

  if (currentTurn === "player") {
    animateAttack(
      pokemon1,
      pokemon2,
      playerSprite,
      monsterSprite,
      () => {
        if (pokemon2.health <= 0) {
          handleRoundEnd("player");
          return;
        }
        currentTurn = "monster";
        battleLocked = false;
      }
    );
  } else {
    animateAttack(
      pokemon2,
      pokemon1,
      monsterSprite,
      playerSprite,
      () => {
        if (pokemon1.health <= 0) {
          handleRoundEnd("computer");
          return;
        }
        currentTurn = "player";
        battleLocked = false;
      }
    );
  }
}

// ===== GO BUTTON =====
btn.addEventListener("click", async () => {
  const d1 = await fetchPokemonData(char1.value);
  const d2 = await fetchPokemonData(char2.value);

  if (!d1 || !d2 || char1.value === char2.value) {
    alert("Choose two different Pokémon!");
    return;
  } else {
    centerDiv.style.display = "block";
  }

  searchDiv.style.visibility = "hidden";

  pokemon1 = createPokemon(d1);
  pokemon2 = createPokemon(d2);

  playerSprite.attr("src", pokemon1.sprite).show();
  monsterSprite.attr("src", pokemon2.sprite).show();

  smallPlayerSprite.src = pokemon1.sprite;
  smallMonsterSprite.src = pokemon2.sprite;

  playerNameDiv.textContent = pokemon1.name.toUpperCase();
  monsterNameDiv.textContent = pokemon2.name.toUpperCase();

  updateUI();
  logDiv.innerHTML = "<p>⚔️ Battle started! ⚔️</p>";

  currentTurn = "player";
  battleLocked = false;
  setAttackMode();
});

// ===== BUTTON MODES =====
function setAttackMode() {
  attackBtn.textContent = "Attack!";
  attackBtn.dataset.mode = "attack";
}

function setPlayAgainMode() {
  attackBtn.textContent = "Play Again";
  attackBtn.dataset.mode = "reset";
}

// ===== RESET GAME =====
function resetGame() {
  pokemon1 = null;
  pokemon2 = null;
  currentTurn = "player";
  battleLocked = false;

  playerSprite.hide();
  monsterSprite.hide();

  smallPlayerSprite.src = "";
  smallMonsterSprite.src = "";

  playerNameDiv.textContent = "";
  monsterNameDiv.textContent = "";
  playerHealthSpan.textContent = "";
  monsterHealthSpan.textContent = "";

  logDiv.innerHTML = "";

  searchDiv.style.visibility = "visible";

  char1.selectedIndex = 0;
  char2.selectedIndex = 0;

  setAttackMode();
}

// ===== ATTACK / PLAY AGAIN BUTTON =====
attackBtn.addEventListener("click", () => {
  if (attackBtn.dataset.mode === "attack") {
    battleTurn();
  } else {
    resetGame();
    centerDiv.style.display = "none";
  }
});

// ===== INIT =====
populatePokemonDropdowns();