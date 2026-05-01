// ================== GAME STATE ==================
let deckId = '';
let playerHand = [];
let dealerHand = [];
let bankroll = 1000;
let currentBet = 200;
let doubleUsed = false;
let dealerHiddenCard = null;

// ================== INIT ==================
async function initializeGame() {
    const response = await fetch(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    const data = await response.json();
    deckId = data.deck_id;
    newRound();
}

// ================== DRAW CARD ==================
async function drawCard() {
    const res = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    const data = await res.json();
    return data.cards[0];
}

// ================== DISPLAY ==================
function displayCards(cards, containerId, hideSecond = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    cards.forEach((card, index) => {
        const img = document.createElement('img');

        if (hideSecond && index === 1) {
            img.src = 'https://deckofcardsapi.com/static/img/back.png';
        } else {
            img.src = card.image;
        }

        container.appendChild(img);
    });
}

// ================== TOTALS ==================
function calculateTotal(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['JACK', 'QUEEN', 'KING'].includes(card.value)) {
            total += 10;
        } else if (card.value === 'ACE') {
            total += 11;
            aces++;
        } else {
            total += parseInt(card.value);
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
  
    return total;
}

function updateTotals() {
    document.getElementById('playerTotal').textContent =
        calculateTotal(playerHand);

    if (dealerHiddenCard) {
        document.getElementById('dealerTotal').textContent =
            calculateTotal([dealerHand[0]]);
    } else {
        document.getElementById('dealerTotal').textContent =
            calculateTotal(dealerHand);
    }
}

function updateBankroll() {
    document.getElementById('bankrollDiv').textContent =
        `Bankroll: $${bankroll}`;
}

// ================== NEW ROUND ==================
async function newRound() {
    playerHand = [];
    dealerHand = [];
    dealerHiddenCard = null;
    doubleUsed = false;

    document.getElementById('message').textContent = '';

    // Deal player
    playerHand.push(await drawCard());
    playerHand.push(await drawCard());

    // Deal dealer (1 hidden)
    dealerHand.push(await drawCard());
    dealerHiddenCard = await drawCard();

    displayCards(playerHand, 'player-cards');
    displayCards(dealerHand, 'dealer-cards', true);

    updateTotals();
    updateBankroll();
}

// ================== GAME ACTIONS ==================
async function hit() {
    playerHand.push(await drawCard());
    displayCards(playerHand, 'player-cards');
    updateTotals();

    if (calculateTotal(playerHand) > 21) {
        endRound();
    }
}

async function stand() {
    endRound();
}

async function doubleBet() {
    if (doubleUsed) return;
    if (bankroll < currentBet * 2) return;

    bankroll -= currentBet;
    currentBet *= 2;
    doubleUsed = true;

    await hit();
    endRound();
}

// ================== END ROUND ==================
async function endRound() {
    // Reveal dealer card
    dealerHand.push(dealerHiddenCard);
    dealerHiddenCard = null;

    let dealerTotal = calculateTotal(dealerHand);
    const playerTotal = calculateTotal(playerHand);

    while (dealerTotal < 17) {
        dealerHand.push(await drawCard());
        dealerTotal = calculateTotal(dealerHand);
    }

    displayCards(dealerHand, 'dealer-cards');
    updateTotals();

    let message = '';

    if (playerTotal > 21) {
        bankroll -= currentBet;
        message = 'You bust!';
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        bankroll += currentBet;
        message = `You WIN! $${currentBet}`;
    } else if (playerTotal < dealerTotal) {
        bankroll -= currentBet;
        message = 'Dealer wins.';
    } else {
        message = 'Push.';
    }

    document.getElementById('message').textContent = message;
    updateBankroll();
}

// ================== BUTTONS ==================
document.getElementById('hitBtn').onclick = hit;
document.getElementById('standBtn').onclick = stand;
document.getElementById('doubleBtn').onclick = doubleBet;
document.getElementById('playAgainBtn').onclick = newRound;

// ================== START ==================
initializeGame();
