let gameStarted = false;
let players = document.querySelectorAll('.player');
let doll = document.getElementById('doll');
let dollState = document.getElementById('doll-state'); // For showing "Watch" or "Hide"
let moveButton = document.getElementById('move-btn');
let gameMessage = document.getElementById('game-message');
let scoreDisplay = document.getElementById('score');
let moveStep = 20; // The amount each player moves up on button click
let playerPositions = Array(6).fill(0); // Array to store player positions
let disqualifiedPlayers = [];
let dollLooking = false;
let gameOver = false;
let totalPlayers = 6;
let playersCrossedFinishLine = 0;

// Start or stop the game
moveButton.addEventListener('click', () => {
  if (gameOver) {
    restartGame();
  } else {
    movePlayers();
  }
});

function startGame() {
  gameStarted = true;
  moveButton.innerText = "Move";  // Button text when game starts
  gameMessage.innerText = ''; // Reset any previous game messages
  scoreDisplay.innerText = ''; // Reset score
  resetPlayers();
  disqualifiedPlayers = [];
  playersCrossedFinishLine = 0;
  gameOver = false;
  dollLooking = false;
  playerPositions = Array(6).fill(0); // Reset positions of players
  changeDollState(); // Start the doll's state change
}

function movePlayers() {
  players.forEach((player, index) => {
    if (disqualifiedPlayers.includes(index)) return; // Skip disqualified players

    if (!dollLooking) {
      playerPositions[index] += moveStep; // Move player upwards
      player.style.transform = `translateY(-${playerPositions[index]}px)`;
      checkForDisqualification(index, player); // Check if player moved when doll was watching
    }
  });

  // Check if any player has reached the Move button (which is also the finish line in this case)
  players.forEach((player, index) => {
    const moveButtonRect = moveButton.getBoundingClientRect();
    const playerPosition = player.getBoundingClientRect();
    if (playerPosition.top <= moveButtonRect.top && !disqualifiedPlayers.includes(index)) {
      gameOver = true;
      gameMessage.innerText = "Game Over: Player reached the finish line!";
      scoreDisplay.innerText = `Players who made it: ${playersCrossedFinishLine}`;
      moveButton.innerText = "Restart Game"; // Change button text to Restart
    }
  });

  // Check if any player crossed the finish line (top of the doll)
  players.forEach((player, index) => {
    if (playerPositions[index] >= 150 && !disqualifiedPlayers.includes(index)) { // Adjusted finish line position (top of the doll)
      playersCrossedFinishLine++;
      if (playersCrossedFinishLine === totalPlayers) {
        winGame();
      }
    }
  });
}

function checkForDisqualification(index, player) {
  const playerPosition = player.getBoundingClientRect();
  const dollPosition = doll.getBoundingClientRect();

  if (dollLooking && playerPosition.top < dollPosition.top) {
    // Disqualify player if they moved while the doll was watching
    if (!disqualifiedPlayers.includes(index)) {
      player.style.backgroundColor = "#ff0000"; // Disqualified player turns red
      disqualifiedPlayers.push(index);
    }
  }
}

function winGame() {
  if (!gameOver) {
    gameOver = true;
    gameMessage.innerText = "Game Over: You Win! Some players reached the finish line.";
    scoreDisplay.innerText = `Players who made it: ${playersCrossedFinishLine}`;
    moveButton.innerText = "Restart Game"; // Change button text to Restart
  }
}

function resetPlayers() {
  players.forEach((player, index) => {
    player.style.backgroundColor = "#2d2d2d"; // Reset player color
    player.style.transform = "translateY(0px)"; // Reset position
    playerPositions[index] = 0; // Reset position
  });
}

function restartGame() {
  // Reset game variables
  playersCrossedFinishLine = 0;
  disqualifiedPlayers = [];
  playerPositions = Array(6).fill(0);
  gameMessage.innerText = '';
  scoreDisplay.innerText = '';
  gameOver = false;
  moveButton.innerText = "Move"; // Set Move button text back to "Move"
  startGame(); // Start the game again
}

function changeDollState() {
  setInterval(() => {
    if (!gameOver) {
      dollLooking = !dollLooking;
      if (dollLooking) {
        dollState.innerText = "Watch";  // Display "Watch" when doll is looking
        doll.style.transform = "rotateY(180deg)"; // Doll turns to face players
      } else {
        dollState.innerText = "Hide";  // Display "Hide" when doll is not looking
        doll.style.transform = "rotateY(0deg)"; // Doll turns away
      }
    }
  }, 2000); // Doll switches states every 2 seconds
}
