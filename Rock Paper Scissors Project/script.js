
    // Declare constants
    const choices = ["Rock", "Paper", "Scissors", "Shoot!"];
    const emojis = { "Rock": "🪨", "Paper": "📄", "Scissors": "✂️"};

    const message = document.getElementById("message");
    const compOutput = document.getElementById("compOutput");
    const userOutput = document.getElementById("userOutput");
    const choicesDisplay = document.getElementById("choicesDisplay");

    // Declare variables
    let compScore = 0;
    let userScore = 0;
    let index = 0;

    function countDown(number){
      index = 0;
      choicesDisplay.textContent = ""; // clear old choices
      message.textContent = "";

      let timer = setInterval(() => {
        message.textContent = choices[index];
        index++;
        if(index > 3){
          clearInterval(timer);
          setTimeout(() => {
            playRound(number);
          }, 1000);
        }
      }, 500);
    }

    function playRound(number){
      const compChoice = choices[Math.floor(Math.random() * 3)];
      const userChoice = choices[number];

      // Show what both chose
      choicesDisplay.innerHTML = `
        You chose ${userChoice} ${emojis[userChoice]} <br>
        Computer chose ${compChoice} ${emojis[compChoice]}
      `;

      // Determine result
      if(userChoice === compChoice){
        message.textContent = "It's a tie!";
      } else if (
        (userChoice == "Rock" && compChoice == "Scissors")||
        (userChoice == "Paper" && compChoice == "Rock")||
        (userChoice == "Scissors" && compChoice == "Paper")
      ){
        message.textContent = "You win!";
        userScore++;
        userOutput.textContent = "User Score: " + userScore;
      } else {
        message.textContent = "You lose!";
        compScore++;
        compOutput.textContent = "Computer Score: " + compScore;
      }
    }
 