function parseTweets(runkeeper_tweets) {
	var written_text = [];
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var input = document.getElementById("textFilter").value;
	document.getElementById("searchText").innerText = input;
	var full_table = "";
	for(var i = 0; i < tweet_array.length; i++){
		if (input.length == 0){
			written_text = [];
		}
		else if(tweet_array[i].written == true && tweet_array[i].source == "completed_event" && tweet_array[i].text.includes(input)){
			written_text.push(tweet_array[i].text);
			full_table += tweet_array[i].getHTMLTableRow(i);
		}
	}
	for(var i = 0; i < written_text.length; i++){
		
	}
	document.getElementById("searchCount").innerText = written_text.length;
	console.log(full_table);
	document.getElementById("tweetTable").innerHTML = full_table;
}

function addEventHandlerForSearch() {
	document.addEventListener('input', function (event) {
		var input = document.getElementById("textFilter").value;
		if (event.key != "Backspace"){
			document.getElementById("searchText").innerText = input;
		}
		else{
			input = input.substring(0, (input.length) - 1);
			document.getElementById("searchText").innerText = input;
		}
		parseFilteredTweets();
	});
}


function parseFilteredTweets()
{
	var written_text = [];
	var input = document.getElementById("textFilter").value;
	document.getElementById("searchText").innerText = input;
	var full_table = "";
	var count = 0;
	for(var i = 0; i < tweet_array.length; i++){
		if (input.length == 0){
			written_text = [];
		}
		else if(tweet_array[i].written == true && tweet_array[i].source == "completed_event" && tweet_array[i].text.includes(input)){
			count++;
			written_text.push(tweet_array[i].text);
			full_table += tweet_array[i].getHTMLTableRow(count);
		}
	}
	document.getElementById("searchCount").innerText = written_text.length;
	console.log(full_table);
	document.getElementById("tweetTable").innerHTML = full_table;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});