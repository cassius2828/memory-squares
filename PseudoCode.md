
# General Goal of the Game:
- Players are required to match the order of flashing squares indicated by the CPU. Each square will flash for approximately one second. Users select the correct squares and submit their answer.
- Upon each successful submission, players press the "next" button and must remember an additional square.
- Submitting the incorrect pattern results in a loss, and players are given the option to play again.
- Each round is timed. If the time expires before a submission, the player loses the game.
- The playing grid is a 4x4 layout.

## Comparing CPU Squares and Player Squares:
- Two arrays will be used to compare selections during the 'submit' button event.
- The CPU array will have a randomly generated square within the grid range added to it each time the 'start' button or 'next level' button is pressed.
- User selections will be captured through square event listeners and pushed to their array. These selections are then compared with the CPU array upon pressing the 'submit' button.

## Ensuring Consistency:
- Implement features to disable buttons when appropriate. For example, players cannot select the 'next' button until they submit a guess.
- Display level status after submissions to inform players of their progress and the current game level.

## Extra Features:
- If time permits, additional fun features such as optional audio during gameplay, randomly generated background colors, and a fun, engaging user interface will be implemented.

## Potential Pitfalls:
1. **Timers Continuing After Level Completion**:
   - Address this issue by ensuring timers and intervals are cleared after each submission to prevent carry-over into the next level.

2. **Squares Not Highlighting Correctly**:
   - Maintain a clear order of operations for square highlighting to ensure all relevant squares flash as expected.

3. **Synchronization of Arrays for Proper Comparisons**:
   - Implement checks to ensure that the user and CPU arrays synchronize correctly for accurate comparison after each round.

