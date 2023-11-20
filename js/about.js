function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	let options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	const f_date = tweet_array[0].time;
	const d = new Date(f_date);
	let text = d.toLocaleDateString("en-US", options);

	const l_date = tweet_array[tweet_array.length - 1].time;
	const x = new Date(l_date);
	let t = x.toLocaleDateString("en-US",options);
	//Dates
	document.getElementById('firstDate').innerText = text;
	document.getElementById('lastDate').innerText = t;

	//Counts
	var complete = 0;
	var live = 0;
	var achieve = 0;
	var misc = 0;
	var written = 0;
	for (let i=0; i<tweet_array.length; i++){
		if (tweet_array[i].source == "completed_event"){
			if (tweet_array[i].written == true){
                written++;
				complete++;
            }else{
				complete++;
			}
		}
		else if (tweet_array[i].source == "achievement"){
			achieve++;
		}
		else if (tweet_array[i].source == "live_event"){
			live++;
		}
		else{
			misc++;
		}
	}
	var compPct = math.format(complete / tweet_array.length * 100,  {notation: 'fixed', precision: 2})  + "%";
	var livePct = math.format(live / tweet_array.length * 100,  {notation: 'fixed', precision: 2})  + "%";
	var achievePct = math.format(achieve / tweet_array.length * 100,  {notation: 'fixed', precision: 2})  + "%";
	var miscPct = math.format(misc / tweet_array.length * 100,  {notation: 'fixed', precision: 2})  + "%";
	var writtenPct = math.format(written / complete * 100,  {notation: 'fixed', precision: 2})  + "%";
	//Completed Events
	document.getElementsByClassName("completedEvents")[0].innerHTML = complete;
	document.getElementsByClassName("completedEventsPct")[0].innerHTML = compPct;
	//live events
	document.getElementsByClassName("liveEvents")[0].innerHTML = live;
	document.getElementsByClassName("liveEventsPct")[0].innerHTML = livePct;
	//achievements
	document.getElementsByClassName("achievements")[0].innerHTML = achieve;
	document.getElementsByClassName("achievementsPct")[0].innerHTML = achievePct;
	//misc
	document.getElementsByClassName("miscellaneous")[0].innerHTML = misc;
	document.getElementsByClassName("miscellaneousPct")[0].innerHTML = miscPct;
	//written
	document.getElementsByClassName("completedEvents")[1].innerHTML = complete;
	document.getElementsByClassName("written")[0].innerHTML = written;
	document.getElementsByClassName("writtenPct")[0].innerHTML = writtenPct;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});