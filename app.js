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
    cpuArray.length === 16 &&
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

// RESET BTN
resetBtn.addEventListener("click", () => {
  squares.forEach((item) => item.classList.remove("flash"));

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
});

// START BTN
startBtn.addEventListener("click", (e) => {
  if (disableStart) return;
  startTimer();
  squares.forEach((item) => squaresArray.push(item));
  //   allows the num type to match the id
  cpuArray.push(randomNumUpTo15().toString());

  document.getElementById(cpuArray[0]).classList.add("flash");
  setTimeout(() => {
    document.getElementById(cpuArray[0]).classList.remove("flash");
  }, 1000);
  nextBtn.classList.remove("hide");
  submitBtn.classList.remove("hide");
  startBtn.classList.add("hide");
  startBtn.toggleAttribute;
});

// NEXT BTN
nextBtn.addEventListener("click", (e) => {
  nextBtn.toggleAttribute("disabled");
  startTimer();
  h1.innerText = "Do You Remember?";
  h1.style.color = "#f2f2f2";
  userArray = [];

  // recursive function to ensure we get a square that has not been used yet
  let randomNum = returnNewRandomNum();
  console.log(
    "This is the accepted verison of randomNum we get -->  ",
    randomNum
  );
  cpuArray.push(randomNum);
  // resets lights on each new turn
  cpuArray.forEach((num, idx) => {
    // this nested set timeout ensures that the last added value to the array
    // gets its flash class removed after 1 second
    setTimeout(() => {
      document.getElementById(cpuArray[idx]).classList.add("flash");
      setTimeout(() => {
        document.getElementById(cpuArray[idx]).classList.remove("flash");
      }, 1000);
    }, 500);
  });

  // removes all of the flash classes in the elements
  //  of the array that existed before the last addition
  cpuArray.forEach((num, idx) =>
    document.getElementById(cpuArray[idx]).classList.remove("flash")
  );

  ///////////////////////////
  // * Functions | Nxt Btn
  ///////////////////////////

  // recursive function to ensure we get a square that has not been used yet
  function returnNewRandomNum() {
    let randomNum = randomNumUpTo15().toString();
    if (cpuArray.includes(randomNum)) {
      console.log("we cannot use this, it is already here --> ", randomNum);
      return returnNewRandomNum();
    } else if (randomNum !== undefined && randomNum < 16) {
      console.log("is this a corrupt value? -->   ", randomNum);
      return randomNum;
    } else return returnNewRandomNum();
  }

  // flash squares for the user to see before making their submission
  function flashSquares() {
    if (testIndexLength <= cpuArray.length) {
      setTimeout(() => {
        for (let i = 0; i < testIndexLength; i++) {
          document.getElementById(cpuArray[i]).classList.add("flash");
        }
        setTimeout(() => {
          for (let i = 0; i < testIndexLength; i++) {
            document.getElementById(cpuArray[i]).classList.remove("flash");
          }
        }, 1000);
      }, 500);
    }
    testIndexLength++;
  }
  flashSquares();
  console.log(userArray);
  console.log(" ");
  console.log(cpuArray);

  grid.toggleAttribute("disabled");
});

// functions
function randomNumUpTo15() {
  return Math.floor(Math.random() * 16);
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
