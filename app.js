/*
random color num limit = 100
STEPS:
1. Select random index 0 - 15 for each turn. 
- First turn will highlight the first square for 1 sec
- Next turn will highlight the first and second square
- goes up to 10
2. Store the random indexes in an array for the length of the game
- On an interval, it will trigger an event that will change the color of the square for 1 second

3. Match the random squares from the CPU
- store user inputs in an array that will compare their's to the CPU array
once the length of the user array is the same length as the CPU array 
4. start,reset,play again features
5.


1. General Goal of Game:
- players will have to match the order of flashing squares from the cpu. Squares will 
flash for approximately 1 second and the user will select the correct squares and submit their answer
- Upon each successful submission, the user will press next and now have to remember one additional square
- If they cubmit the wrong pattern they will lose the game and have the option to play again
- There will be a time limit for each round, if the time expires before a submittal, the player loses the game
- Grid will be 4x4 

2. Comparing CPU squares and player squares
- I plan on having two arrays that will need to be compared upon the submit btn event
- The CPU will have a random square generated for them within the grid range and added to 
the CPU array upon the press of the start btn and next level btn
- User squares will be pushed to their array from the square event listeners and compared 
with the cpu array upon the submit btn

3. Ensuring Consistency:
- Implement features to disable btns when appropriate
ex: cannot select next until you submit a guess
- Display level status after submissions and the level progress during gameplay

4. Extra features:
- if alloted tiem, will implement fun features such as optional audio during the game,
random generating background colors, and a fun / engaging UI 

Potential Pitfalls:
1) Timers continuing to run after level pass
- this will be addressed by ensuring I clean up the interval / timer after each submission

2) Squares not highlighting correctly:
- will ensure I have a good order of logic when highlighting squares to make sure all squares that
should be highlighted will

3) synchronization of arrays for proper comparisons

*/

///////////////////////////
// * Variables
///////////////////////////
let cpuArray = [];
let userArray = [];
let squaresArray = [];
let testIndexLength = 0;
let disableStart = false;
let countdownInSeconds = 55;
let intervalID;
let gridSize = 4;
let currentNum;
let finalGrid = [];
let lastRowStart = gridSize * gridSize - gridSize;
let lastRowStop = gridSize * gridSize - 1;
///////////////////////////
// * Events and Query Selectors
///////////////////////////
const grid = document.querySelector(".grid-container");
const squares = document.querySelectorAll(".square");
const h1 = document.querySelector("h1");
const timerDisplay = document.querySelector("#timer");
console.log(timerDisplay);
const startBtn = document.querySelector(".start");
const nextBtn = document.querySelector(".next");
const submitBtn = document.querySelector(".submit");
const resetBtn = document.querySelector(".reset");

/*
HOW I CAN CHOOSE THE CONNECTED SQUARES TO FORM THE PATH PROPERLY
1. initialize a gris size (gs) var
2. Choose a random number as the starting num (sn) bw 0 and the gs -1
3. Set restrictions for the next num to be one of the following
sn - 1, sn + 1
sn + gs -1, sn + gs, sn + gs + 1
4. Last row must be only selected once then that will complete the level
*/

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
buildTheGrid();
// ANY GRID BTN
grid.addEventListener("click", (e) => {
  if (!cpuArray.length || h1.innerText === "YOU LOSE") return;
  userArray.push(e.target.id);

  document.getElementById(e.target.id).classList.add("flash");
  console.log(userArray);
});

// SUBMIT BTN
submitBtn.addEventListener("click", (e) => {
  pauseTimer();
  if (JSON.stringify(userArray) !== JSON.stringify(cpuArray)) {
    h1.innerText = "YOU LOSE";
    h1.style.color = "red";
    resetBtn.classList.remove("hide");
    nextBtn.classList.add("hide");
  } else if (
    cpuArray.length === gridSize * gridSize &&
    JSON.stringify(userArray) === JSON.stringify(cpuArray)
  ) {
    h1.innerText = `You are the Ultimate Winner!!!`;
    h1.style.color = "gold";
  } else {
    h1.innerText = `Level ${cpuArray.length} Passed!`;
    h1.style.color = "green";
  }
  nextBtn.toggleAttribute("disabled");
});
function reset() {
  cpuArray = [];
  userArray = [];
  squaresArray = [];
  testIndexLength = 0;
  h1.innerText = "Do You Remember?";
  h1.style.color = "#f2f2f2";
  nextBtn.classList.add("hide");
  resetBtn.classList.add("hide");
  submitBtn.classList.add("hide");
  startBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", true);
  countdownInSeconds = 55;
  renderTimeLeft();
}
// RESET BTN
resetBtn.addEventListener("click", () => {
  squares.forEach((item) => item.classList.remove("flash"));

  reset();
});

// START BTN
startBtn.addEventListener("click", async (e) => {
  if (disableStart) return;
  // startTimer();
  // squares.forEach((item) => squaresArray.push(item));
  // //   allows the num type to match the id
  addAllSquares();
  flashSquares();
  // document.getElementById(cpuArray[0]).classList.add("flash");
  // setTimeout(() => {
  //   document.getElementById(cpuArray[0]).classList.remove("flash");
  // }, 1000);
  nextBtn.classList.remove("hide");
  submitBtn.classList.remove("hide");
  startBtn.classList.add("hide");
  startBtn.toggleAttribute;
});

// NEXT BTN
nextBtn.addEventListener("click", (e) => {
  // cpuArray.forEach((num, idx) =>
  //   document.getElementById(cpuArray[idx]).classList.remove("flash")
  // );
  reset();

  nextBtn.toggleAttribute("disabled");
  startTimer();

  gridSize++;
  lastRowStart = gridSize * gridSize - gridSize;
  lastRowStop = gridSize * gridSize - 1;
  buildTheGrid();
  addAllSquares();
  flashSquares();
  ///////////////////////////
  // * Functions | Nxt Btn
  ///////////////////////////

  // recursive function to ensure we get a square that has not been used yet
  // function returnNewRandomNum() {
  //   let randomNum = randomNumFollowingGridPathRules().toString();
  //   if (cpuArray.includes(randomNum)) {
  //     console.log("we cannot use this, it is already here --> ", randomNum);
  //     return returnNewRandomNum();
  //   } else if (randomNum !== undefined && randomNum < gridSize * gridSize) {
  //     console.log("is this a corrupt value? -->   ", randomNum);
  //     return randomNum;
  //   } else return returnNewRandomNum();
  // }

  console.log(userArray);
  console.log(" ");
  console.log(cpuArray);

  grid.toggleAttribute("disabled");
});

// functions
// recursive function to ensure we get a square that has not been used yet
// let randomNum = returnNewRandomNum();
// console.log(
//   "This is the accepted verison of randomNum we get -->  ",
//   randomNum
// );

// cpuArray.push(randomNum);
// console.log(cpuArray);
// resets lights on each new turn
// cpuArray.forEach((num, idx) => {
//   // this nested set timeout ensures that the last added value to the array
//   // gets its flash class removed after 1 second
//   // setTimeout(() => {
//   //   document.getElementById(cpuArray[idx]).classList.add("flash");
//   //   setTimeout(() => {
//   //     document.getElementById(cpuArray[idx]).classList.remove("flash");
//   //   }, 1000);
//   // }, 500);
// });

//////////////////////////////////////////////////////
// ASYNC FUNC TO PROGRESSIVELY SHOW SQUARES
//////////////////////////////////////////////////////
async function flashSquare(squareId, duration) {
  const square = document.getElementById(squareId);
  square.classList.add("flash");
  await delay(duration);
}
// remove all flash classes after all squares were shown
function removeFlash(squareId) {
  const square = document.getElementById(squareId);
  square.classList.remove("flash");
}
async function flashSequence(sequence) {
  for (let squareId of sequence) {
    // adds squares asynchronously
    await flashSquare(squareId, 500);
  }
  // removes all squares at the same time
  for (let squareId of sequence) {
    removeFlash(squareId);
  }
}
// removes all of the flash classes in the elements
//  of the array that existed before the last addition

// flash squares for the user to see before making their submission
function flashSquares() {
  if (testIndexLength <= cpuArray.length) {
    flashSequence(cpuArray);
    // setTimeout(() => {
    //   for (let i = 0; i < testIndexLength; i++) {
    //     document.getElementById(cpuArray[i]).classList.add("flash");
    //   }
    //   setTimeout(() => {
    //     for (let i = 0; i < testIndexLength; i++) {
    //       document.getElementById(cpuArray[i]).classList.remove("flash");
    //     }
    //   }, 1000);
    // }, 500);
  }
  testIndexLength++;
}

function randomNumUpTo15() {
  return Math.floor(Math.random() * 16);
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
// compares the values in the last row of the grid

console.log(lastRowComp);

function addAllSquares() {
  // moving this out of the global scopes allows the value of the lastRowComp to reflect with the new grid
  let lastRowComp = arrayRange(lastRowStart, lastRowStop, 1);
  let containsLastRowValue = false;
  lastRowComp.map((value) => {
    if (cpuArray.includes(value)) {
      containsLastRowValue = true;
    }
  });
  if (containsLastRowValue) return;
  cpuArray.push(randomNumFollowingGridPathRules().toString());
  console.log(cpuArray);
  return addAllSquares();
}

///////////////////////////
// * TIMER
///////////////////////////
function startTimer() {
  if (intervalID) {
    clearInterval(intervalID);
    countdownInSeconds = 55;
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
