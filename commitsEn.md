- Commit 1:
  - Extract JSON info and perform a basic display
	  - Issues : asynchron behaviour of JS runs the display function first and then the JSON extraction function

- Commit 2:
  - Add some comments omitted in Commit 1
  - Add a vote system
  - Update the score of each cat displayed on the screen after a vote (the winner gains points and the loser points decrease according to the ELO notation system - FIDE current system)

- Commit 3:
  - Create a score table
  - Sort the cats by score to rank them
	  - Issues : if we spam the click, we will vote for the same cat plenty times

- Commit 4:
  - Re-build of the front-end for a responsive design with Bootstrap
  - Add comments in the html and in the CSS files
	  - Issues : icons added in localhost with Bootstrap could not be extracted online