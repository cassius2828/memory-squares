# Memory Game:

## 1. Initialize Game Variables
   - cpuArray: Store sequence of CPU’s random square selections
   - userArray: Store sequence of user’s square selections
   - squaresArray: List of all game squares
   - testIndexLength: Tracks the current sequence length
   - disableStart: Flag to control game start

## 2. Setup UI Elements
   - Query and store references to DOM elements like grid, squares, buttons, and header

## 3. Define Event Listeners
   - Start Button: Begin the game and handle initial square flash
   - Next Button: Progress to the next level, generating a new square sequence
   - Submit Button: Check user’s sequence against CPU’s sequence
   - Reset Button: Reset game to initial state

## 4. Game Logic Functions
   - randomNumUpTo15: Generate a random number from 0 to 15 (indexes of the grid)
   - returnNewRandomNum: Ensure a new, non-repeating random number is chosen
   - flashSquares: Flash the squares in sequence up to the current level

## 5. Game Flow
   - On 'Start' click:
     * Disable start button
     * Flash the first randomly selected square
     * Enable 'Next' and 'Submit' buttons

   - On 'Next' click:
     * Generate next sequence step without repetition
     * Flash all squares in the new sequence

   - On 'Submit' click:
     * Compare user’s sequence with CPU’s
     * Display win or lose message
     * Show 'Reset' button if the game is over

   - On 'Reset' click:
     * Clear all arrays and variables
     * Set header text to initial state
     * Hide game control buttons except 'Start'

## 6. Additional Features
   - Visual effects for square flashes
   - Responsive buttons that toggle availability based on game state

## 7. Game End Conditions
   - Check if user’s sequence matches CPU’s at each level
   - Determine ultimate winner if user matches all sequences up to maximum level
