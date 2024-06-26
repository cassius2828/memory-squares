///////////////////////////
// * Variables
///////////////////////////
// arrays
let cpuArray = [];
let userArray = [];
let squaresArray = [];
// conditions for comparisons
let testIndexLength = 0;
let disableStart = false;
// timer
let countdownInSeconds = 45;
let intervalID;
// grid info
let gridSize = 3;
let currentNum;
let finalGrid = [];
let lastRowStart = gridSize * gridSize - gridSize;
let lastRowStop = gridSize * gridSize - 1;
// this checks to see if all the squares in the cpu array have finished flashing before
// we can select a sqr
let amountOfFlashedSquares;
// audio vars
// audio vars
const gridPressSoundPath = "public/audio/grid-press.wav";
const gridFlashSoundPath = "public/audio/grid-flash.wav";
const levelPassAudio = new Audio("public/audio/level-pass-audio.mp3");
const gameoverAudio = new Audio("public/audio/game-over-buzzer.wav");

// ending game
let level = 1;

///////////////////////////
// * QUERY SELECTORS
///////////////////////////
const grid = document.querySelector(".grid-container");
const squares = document.querySelectorAll(".square");
const h1 = document.querySelector("h1");
const timerDisplay = document.querySelector("#timer");
const highscoreDisplay = document.getElementById("highscore");
// btns
const startBtn = document.querySelector(".start");
const nextBtn = document.querySelector(".next");
const submitBtn = document.querySelector(".submit");
const resetBtn = document.querySelector(".reset");

///////////////////////////
// * LOCAL STORAGE
///////////////////////////

function getHighScore() {
  const highScoreData = localStorage.getItem("highscore");
  return highScoreData
    ? JSON.parse(highScoreData)
    : { score: 0, date: "--/--/----" };
}
function setHighScore(newScore) {
  const highscore = getHighScore();
  if (newScore > highscore.score) {
    const newHighScoreData = {
      score: newScore,
      date: new Date().toLocaleDateString(),
    };
    localStorage.setItem("highscore", JSON.stringify(newHighScoreData));
  }
}
function displayHighScore() {
  const highscore = getHighScore();
  highscoreDisplay.innerText = `HighScore: ${highscore.score} Date: ${highscore.date}`;
}

// initialze the grid
buildTheGrid();

// display high score on mount
document.addEventListener("DOMContentLoaded", (e) => {
  displayHighScore();
});

///////////////////////////
// * EVENTS
///////////////////////////
// ANY GRID BTN
grid.addEventListener("click", (e) => {
  if (amountOfFlashedSquares !== cpuArray.length) return;
  if (!cpuArray.length || h1.innerText === "YOU LOSE") return;
  // prevents duplicate sqrs in user array
  if (userArray.includes(e.target.id)) return;

  userArray.push(e.target.id);
  document.getElementById(e.target.id)?.classList.add("flash");
  const gridPressSound = new Audio(gridPressSoundPath);
  gridPressSound.play();
});

// SUBMIT BTN
submitBtn.addEventListener("click", (e) => {
  if (amountOfFlashedSquares !== cpuArray.length) return;
  pauseTimer();
  // more consistent way to compare the arrays
  const compareArrays = (a, b) => {
    return a.length === b.length && a.every((el, idx) => el === b[idx]);
  };

  if (!compareArrays(userArray, cpuArray)) {
    h1.innerText = "YOU LOSE";
    h1.style.color = "red";
    // audio
    gameoverAudio.play();
    document
      .querySelectorAll(".square")
      .forEach((sqr) => sqr.classList.add("loser"));
    resetBtn.classList.remove("hide");
    nextBtn.classList.add("hide");
  } else {
    h1.innerText = `Level ${level} Passed!`;
    h1.style.color = "green";
    // audio
    levelPassAudio.play();
    document
      .querySelectorAll(".square")
      .forEach((sqr) => sqr.classList.add("winner"));
    setHighScore(level);
    level++;
  }

  submitBtn.toggleAttribute("disabled");
  submitBtn.classList.add("disabled");
  nextBtn.toggleAttribute("disabled");
  nextBtn.classList.remove("disabled");
});

// RESET BTN
resetBtn.addEventListener("click", () => {
  squares.forEach((item) => item.classList.remove("flash"));
  displayHighScore();
  playAgain();
});

// START BTN
startBtn.addEventListener("click", async (e) => {
  if (disableStart) return;
  // reinitialize the grid details so the reset works consistently
  gridSize = gridSize;
  lastRowStart = gridSize * gridSize - gridSize;
  lastRowStop = gridSize * gridSize - 1;
  addAllSquares();
  flashSquares();
  startTimer();
  nextBtn.classList.remove("hide");
  nextBtn.classList.add("disabled");
  submitBtn.classList.remove("hide");
  startBtn.classList.add("hide");
  startBtn.toggleAttribute;
});

// NEXT BTN
nextBtn.addEventListener("click", (e) => {
  prepareNextLevel();
  submitBtn.toggleAttribute("disabled");
  submitBtn.classList.remove("disabled");
  grid.toggleAttribute("disabled");
});

///////////////////////////
// * FUNCTIONS
///////////////////////////
// BUILD THE GRID | this creates a grid based off the grid size
// specified by each level
function buildTheGrid() {
  if (grid.children) {
    grid.innerHTML = "";
  }
  // Update CSS grid properties
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  let createdGrid = Array.from(
    { length: gridSize * gridSize },
    (value, index) => index
  );

  createdGrid.map((sqr, idx) => {
    sqr = document.createElement("div");
    sqr.id = idx;
    sqr.classList.add("square");

    grid.appendChild(sqr);
  });
}

// RESET / PLAY AGAIN
function playAgain() {
  // reset vars
  cpuArray = [];
  userArray = [];
  squaresArray = [];
  testIndexLength = 0;
  level = 1;
  // reset displays
  h1.innerText = `Level ${level}`;
  h1.style.color = "#f2f2f2";
  // set btns to proper displaysF
  nextBtn.classList.add("hide");
  resetBtn.classList.add("hide");
  submitBtn.classList.add("hide");
  submitBtn.toggleAttribute("disabled");
  submitBtn.classList.remove("disabled");
  startBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", true);
  nextBtn.classList.add("disabled");
  // reset countdown
  countdownInSeconds = 45;
  renderTimeLeft();
  // reset grid
  gridSize = 3;
  buildTheGrid();
}

//////////////////////////////////////////////////////
// check to see how many flashed sqrs exist
//////////////////////////////////////////////////////
function cpuFinishedFlashing() {
  // Convert grid.children to an array and filter elements with the class "flash"
  let flashedItems = Array.from(grid.children).filter((el) =>
    el.classList.contains("flash")
  );

  return flashedItems;
}

// PREPARE THE NEXT LEVEL
function prepareNextLevel() {
  // vars
  cpuArray = [];
  userArray = [];
  squaresArray = [];
  testIndexLength = 0;
  // displays
  h1.innerText = `Level ${level}`;
  h1.style.color = "#f2f2f2";
  countdownInSeconds = 45;
  renderTimeLeft();

  // btn
  nextBtn.toggleAttribute("disabled");
  nextBtn.classList.add("disabled");
  // grid
  gridSize++;
  lastRowStart = gridSize * gridSize - gridSize;
  lastRowStop = gridSize * gridSize - 1;
  buildTheGrid();
  addAllSquares();
  flashSquares();
  startTimer();
}
//////////////////////////////////////////////////////
// ASYNC FUNC TO PROGRESSIVELY SHOW SQUARES
//////////////////////////////////////////////////////
async function flashSquare(squareId, duration) {
  const square = document.getElementById(squareId);
  square.classList.add("flash");
  await delay(duration);
  // sets amount of flashedsqrs before clearing flash so we can control the 
  // selection of the userarry till after the squares finished
  amountOfFlashedSquares = cpuFinishedFlashing().length;
}
// remove all flash classes after all squares were shown
function removeFlash(squareId) {
  const square = document.getElementById(squareId);
  square.classList.remove("flash");
}
async function flashSequence(sequence) {
  for (let squareId of sequence) {
    // adds squares asynchronously
    const gridFlashSound = new Audio(gridFlashSoundPath);
    gridFlashSound.play();
    await flashSquare(squareId, 500);
  }
  // removes all squares at the same time
  for (let squareId of sequence) {
    removeFlash(squareId);
  }
}

// flash squares for the user to see before making their submission
function flashSquares() {
  if (testIndexLength <= cpuArray.length) {
    flashSequence(cpuArray);
  }
  testIndexLength++;
}

function randomRow() {
  return Math.floor(Math.random() * startingNum);
}

//////////////////////////////////////////////////////
// Follows path guidelines from start to finish
//////////////////////////////////////////////////////
function randomNumFollowingGridPathRules() {
  // if this is the first square to be selected, it must be in the first row
  if (cpuArray.length === 0) {
    let firstSqr = Math.floor(Math.random() * gridSize);
    currentNum = firstSqr;
    return firstSqr;
  } else {
    // decidees if we will stay in the current row or go to the next row
    currentNum = chooseRow();
    // ensures we do not get any duplicates in our grid
    if (cpuArray.includes(currentNum?.toString())) {
      return randomNumFollowingGridPathRules();
    }
    return currentNum;
  }
}
////////////////////////////////////
// Chose which row | Same or Next
////////////////////////////////////
function chooseRow() {
  let chooseRow = Math.floor(Math.random() * 2);
  if (chooseRow === 0) {
    return chooseTheSameRow();
  } else {
    return chooseTheNextRow();
  }
}
///////////////////////////
// Same Row Was Chosen
///////////////////////////
function chooseTheSameRow() {
  // following is the logic for selecting a sqr in the same row
  let chooseSqr = Math.floor(Math.random() * 2);
  if (chooseSqr === 0) {
    if (currentNum % gridSize === 0) {
      // recall the function if the current sqr is on the far left side and has no option
      // to follow a path to the left of the current sqr
      return randomNumFollowingGridPathRules();
    } else {
      // select the sqr to the left of the current sqr
      return currentNum - 1;
    }
  } else {
    // if it is on the far right row then it cannot select the square to the right
    if (currentNum % gridSize === gridSize - 1) {
      return randomNumFollowingGridPathRules();
    } else {
      // select the sqr to the right of the current sqr
      return currentNum + 1;
    }
  }
}
///////////////////////////
// Next Row Was Chosen
///////////////////////////
function chooseTheNextRow() {
  let chooseSqr = Math.floor(Math.random() * 3);
  if (chooseSqr === 0) {
    // if it is on the far left row then it cannot select the
    //  square up 1 & to the left
    if (currentNum % gridSize === 0) {
      return chooseTheNextRow();
    } else {
      // this option can always be selected
      return currentNum + gridSize - 1;
    }
  } else if (chooseSqr === 1) {
    return currentNum + gridSize;
  } else {
    // if it is on the far right row then it cannot select the
    //  square up 1 & to the right
    if (currentNum % gridSize === gridSize - 1) {
      return chooseTheNextRow();
    } else {
      return currentNum + gridSize + 1;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////
// Recursive Func to continuing adding sqrs until the last row has one
/////////////////////////////////////////////////////////////////////////////////

// gets an array in the desired range
const arrayRange = (start, stop, step) => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    // to string allows us to compare the value since this will produce numbers
    (value, index) => (start + index * step).toString()
  );
};

// ADDS ALL SQUARES TO THE GRID
function addAllSquares() {
  // moving this out of the global scopes allows the value of the lastRowComp to reflect with the new grid
  // compares the values in the last row of the grid
  let lastRowComp = arrayRange(lastRowStart, lastRowStop, 1);
  let containsLastRowValue = false;
  lastRowComp.map((value) => {
    if (cpuArray.includes(value)) {
      containsLastRowValue = true;
    }
  });
  if (containsLastRowValue) return;
  cpuArray.push(randomNumFollowingGridPathRules().toString());
  return addAllSquares();
}

///////////////////////////
// * TIMER
///////////////////////////

// start timer
function startTimer() {
  if (intervalID) {
    clearInterval(intervalID);
    countdownInSeconds = 45;
  }
  intervalID = setInterval(() => {
    renderTimeLeft();
    countdownInSeconds--;
    if (countdownInSeconds < 6) {
      timerDisplay.style.color = "red";
    }
    // ends game if timer runs out
    if (countdownInSeconds < 0) {
      clearInterval(intervalID);
      h1.innerText = "YOU LOSE";
      h1.style.color = "red";
      resetBtn.classList.remove("hide");
      nextBtn.classList.add("hide");
    }
  }, 1000);
}
// pause timer
function pauseTimer() {
  clearInterval(intervalID);
}

// renderTimeLeft -- ensure format is consistent
function renderTimeLeft() {
  if (countdownInSeconds > 9) {
    timerDisplay.innerText = `00:${countdownInSeconds}`;
  } else {
    timerDisplay.innerText = `00:0${countdownInSeconds}`;
  }
}

// handle delays
// this creates a new promise with a setTimeout of our inputed milliseconds
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
