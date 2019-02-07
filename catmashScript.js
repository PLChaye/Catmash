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
		
		getCats : function(fileName){

			//Requesting the content of a JSON file
			var request = new XMLHttpRequest();

			request.open('GET', fileName);
			request.responseType = 'json'; //Parse the content as a json file
			request.send();

			request.onload = function(){
				var content = request.response,
					numberOfCats = catmash.fromJSON.getLength(content);

				for(var i = 0; i < numberOfCats; i++){
					catmash.fromJSON.storeCats(i, content);
				}
			}
		},

		getLength : function(JSONcontent){
			return JSONcontent.images.length;
		},

		storeCats : function(tableIndex, JSONcontent){
			//Create an object wth all the JSON infos
			var newCat = new catmash.Cat(JSONcontent.images[tableIndex].id, JSONcontent.images[tableIndex].url, 0, 0);

			//Add the new cat in the table containing all the cats
			catmash.catsDatabase.push(newCat);
		}
	},

	//All the mathematical operations
	doTheMath: {
		getTwoRandomInt : function(max){
			var randomInt1,
				randomInt2;

			do{
				randomInt1 = this.getRandomInt(max);
				randomInt2 = this.getRandomInt(max);
			}while(randomInt1 == randomInt2);

			return [randomInt1, randomInt2];
		},

		getRandomInt : function(max){
			return Math.floor(Math.random() * Math.floor(max));
		}
	},

	display: {
		twoRandomCats: function(){
			
			//Displaying two random cats
			var firstImageCell = document.getElementById('cat1_image'),
				secondImageCell = document.getElementById('cat2_image'),
				firstImage = document.createElement('img');
				secondImage = document.createElement('img');
				randomIndexes = catmash.doTheMath.getTwoRandomInt(catmash.catsDatabase.length);

			firstImage.src = catmash.catsDatabase[randomIndexes[0]].photo;
			firstImage.alt = catmash.catsDatabase[randomIndexes[0]].id;
			secondImage.src = catmash.catsDatabase[randomIndexes[1]].photo;
			secondImage.alt = catmash.catsDatabase[randomIndexes[1]].id;

			firstImageCell.replaceChild(firstImage, firstImageCell.firstChild);
			secondImageCell.replaceChild(secondImage, secondImageCell.firstChild);
		}
	}
};

//Fetch and store the content of the JSON file
catmash.fromJSON.getCats('cats.json');

//Displaying two random cats
setTimeout(function(){
	catmash.display.twoRandomCats();
}, 2000);