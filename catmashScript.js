//////////////// CATMASH ///////////////////


var catmash = {
	
	//All the cats are stored in this array
	catsDatabase : [], 

	//Defining the properties of each cat
	Cat : function(id, photo, score, matches){
		this.id = id; //cat id in the JSON file
		this.photo = photo; //address of the cat's photo
		this.score = score; //score of the cat
		this.matches = matches; //number of matches played

		//Alert all the properties of a cat
		this.display = function(){
			var description='Id : ' + this.id +
							'\nPhoto URL : ' + this.photo +
							'\nScore : ' + this.score +
							'\nNumber of matches played : ' + this.matches;

			alert(description);
		}
	},


	//All the functions extracting data from the JSON file
	fromJSON : {
		
		//Load the JSON file into the catsDatabase array
		getCats : function(fileName){

			//Requesting the content of a JSON file
			var request = new XMLHttpRequest();

			request.open('GET', fileName);
			request.responseType = 'json'; //Parse the content as a json file
			request.send();

			request.onload = function(){
				var content = request.response,
					numberOfCats = catmash.fromJSON.getLength(content);

				//Defining each element as a Cat object and adding them to the database
				for(var i = 0; i < numberOfCats; i++){
					catmash.fromJSON.storeCats(i, content);
				}
			}
		},

		getLength : function(JSONcontent){
			return JSONcontent.images.length;
		},

		//Add each element of the JSON in catsDatabase
		storeCats : function(tableIndex, JSONcontent){
			//Create an object wth all the JSON infos
			var newCat = new catmash.Cat(JSONcontent.images[tableIndex].id, JSONcontent.images[tableIndex].url, 1500, 0);

			//Add the new cat in the table containing all the cats
			catmash.catsDatabase.push(newCat);
		}
	},

	//All the mathematical operations
	doTheMath: {

		//Generate two different random integers
		getTwoRandomInt : function(max){
			var randomInt1,
				randomInt2;

			do{
				randomInt1 = this.getRandomInt(max);
				randomInt2 = this.getRandomInt(max);
			}while(randomInt1 == randomInt2);

			return [randomInt1, randomInt2];
		},

		//Generate one random integer (source : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
		getRandomInt : function(max){
			return Math.floor(Math.random() * Math.floor(max));
		},

		//Change the scores of both cats after a vote
		eloRating : function(winnerIndex, loserIndex){
			//Defining variables needed for the operation
			var winnerScore = catmash.catsDatabase[winnerIndex].score,
				loserScore = catmash.catsDatabase[loserIndex].score,
				winnerKFactor = this.getKFactor(catmash.catsDatabase[winnerIndex].matches, winnerScore),
				loserKFactor = this.getKFactor(catmash.catsDatabase[loserIndex].matches, loserScore),

				//Calculate the new scores
				winnerNewScore = winnerScore + winnerKFactor * (1 - 1 / (1 + Math.pow(10, -(winnerScore - loserScore) / 400))),
				loserNewScore = loserScore + loserKFactor * (0 - 1 / (1 + Math.pow(10, -(loserScore - winnerScore) / 400))),

				//Calculate the changes
				winnerDiff = winnerNewScore - winnerScore;
				loserDiff = loserNewScore - loserScore;

			//Update the new scores
			catmash.catsDatabase[winnerIndex].score = winnerNewScore;
			catmash.catsDatabase[loserIndex].score = loserNewScore;
			
			//Increment the number of matches played
			catmash.catsDatabase[winnerIndex].matches++;
			catmash.catsDatabase[loserIndex].matches++;

			//Return the score changes
			return [winnerDiff, loserDiff];
		},

		//Factor needed to calculate an ELO rating making newcomers scores change more and reducing the range between the top score players
		getKFactor : function(matchesPlayed, score){
			if(matchesPlayed < 30){
				return 40;
			}
			else if(matchesPlayed >= 30 && score < 2400){
				return 20;
			}
			else{
				return 10;
			}
		},

		//Return a fixed number of decimals
		getRoundedFloat(number, numberOfDecimals){
			if(numberOfDecimals == undefined){
				numberOfDecimals = 1;
			}
			return Math.round(number * Math.pow(10, numberOfDecimals)) / Math.pow(10, numberOfDecimals);
		}


	},


	//All the functions operating on the display of the html page
	display: {

		//Displaying two random cats
		twoRandomCats: function(){
			
				//Get the html elements that will contain our cats images
			var firstImageCell = document.getElementById('cat1_image'), 
				secondImageCell = document.getElementById('cat2_image'),

				//Create two images elements
				firstImage = document.createElement('img'); 
				secondImage = document.createElement('img');

				//Generate random numbers to display random cats
				randomIndexes = catmash.doTheMath.getTwoRandomInt(catmash.catsDatabase.length); 

			//Adding the properties of the chosen images
			firstImage.src = catmash.catsDatabase[randomIndexes[0]].photo;
			firstImage.alt = catmash.catsDatabase[randomIndexes[0]].id;
			secondImage.src = catmash.catsDatabase[randomIndexes[1]].photo;
			secondImage.alt = catmash.catsDatabase[randomIndexes[1]].id;

			//Adding the images into the pages 
			firstImageCell.replaceChild(firstImage, firstImageCell.firstChild);
			secondImageCell.replaceChild(secondImage, secondImageCell.firstChild);

			//Adding some events when the user click on a cat (update scores)
			catmash.eventHandler.voteForThisCat();
		},

		//Get an html property of the loser (is he on the right or on the left, what is his image link) using a property of the winner
		getLoserElement : function(winnerPropertyValue, selector, propertyName){
			var element = document.querySelectorAll(selector),
				numberOfElements = element.length;

			for(var i = 0; i < numberOfElements; i++){

				//If we want to get an html identifier
				if(propertyName == 'id'){
					if(winnerPropertyValue != element[i].id){
						return element[i].id;
					}
				}

				//if we want an image source
				else if(propertyName == 'src'){
					if(winnerPropertyValue != element[i].src){
						return element[i].src;
					}
				}
			}
		},

		//Display the gains and the losses of each cat
		scoreChanges : function(scoreDiff, winnerHtmlPosition){

			//Get the html identifiers of the score cells
			var winnerScoreCellId = winnerHtmlPosition.split("_")[0] + '_score',
				loserScoreCellId = this.getLoserElement(winnerScoreCellId, '.score', 'id'),

				//Get the html elements
				winnerScoreCell = document.getElementById(winnerScoreCellId),
				loserScoreCell = document.getElementById(loserScoreCellId);

			winnerScoreCell.innerHTML = '+' + catmash.doTheMath.getRoundedFloat(scoreDiff[0]);
			loserScoreCell.innerHTML = catmash.doTheMath.getRoundedFloat(scoreDiff[1]);

			//Erase the scores one second later
			setTimeout(function(){
				var scoreCells = document.querySelectorAll('.score'),
					scoreCellsNumber = scoreCells.length;

				for(i = 0; i < scoreCellsNumber; i++){
					scoreCells[i].innerHTML = '';
				}
			}, 1000);
		}
	},


	//All the functions adding events to elements
	eventHandler: {

		//Adding events allowing the user to vote for a cat when he clicks
		voteForThisCat : function(){

			//Selecting the two images and grouping them in a table
			var catsDueling = document.querySelectorAll('#cats_container img');

			//Adding an event when the user click on a cat
			catsDueling.forEach(function(element){

				//Change the cursor when the user hover over a cat
				element.addEventListener('mouseover', function(e){
					element.style.cursor = 'pointer';
				})

				//When the user click on a cat
				element.addEventListener('click', function(e){

					//Get the photo index of the winner and the loser in the database
					var winnerIndex = catmash.database.lookForThisPhoto(e.target.src),
						loserIndex = catmash.database.lookForThisPhoto(catmash.display.getLoserElement(e.target.src, '#cats_container img', 'src')),

						//Update the scores of both cats
						scoreDiff = catmash.doTheMath.eloRating(winnerIndex, loserIndex);

					//Display the score changes
					catmash.display.scoreChanges(scoreDiff, e.target.parentNode.id);

					//Wait one second (the time to display the scores) and display two new cats
					setTimeout(function(){
						catmash.display.twoRandomCats();
					}, 1000);
				});
			});
		}
	},


	//All the functions involving a direct operation on the database
	database: {

		//Getting a cat index based on the url of his photo
		lookForThisPhoto : function(photoUrl){
			var databaseSize = catmash.catsDatabase.length;

			for(var i = 0; i < databaseSize; i++){
				if(catmash.catsDatabase[i].photo == photoUrl){
					return i;
				}
			}
		}
	}
};

//Fetch and store the content of the JSON file
catmash.fromJSON.getCats('cats.json');


//Displaying two random cats
setTimeout(function(){	
	catmash.display.twoRandomCats();
}, 500);