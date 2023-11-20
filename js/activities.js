function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var completed_events = [];
	let activity_map = {};
	for(var i = 0;i < tweet_array.length;i++){
		if (tweet_array[i].source == "completed_event"){
			completed_events.push(tweet_array[i].activityType);
		}
	}
	for(var i = 0;i < completed_events.length;i++){
		let currentWordCount = activity_map[completed_events[i]];
    	let count = currentWordCount ? currentWordCount : 0;
    	activity_map[completed_events[i]] = count + 1;
	}
	let types_of_activities = Array.from(new Set(completed_events));
	var bike = Object.keys(activity_map)[2];
	document.getElementById('numberActivities').innerText = types_of_activities.length;
	document.getElementById('firstMost').innerText = Object.keys(activity_map)[0] + "ning";
	document.getElementById('secondMost').innerText = Object.keys(activity_map)[1] + "ing";
	document.getElementById('thirdMost').innerText = Object.keys(activity_map)[2].substring(0,(bike.length) - 1) + "ing";
	
	var act_arr =[];

	for (var i = 0; i < 12; i++) {
		let j = {};
		j["a"] = Object.keys(activity_map)[i];
		j["b"] = Object.values(activity_map)[i];
		act_arr.push(j);
	}

	var runDist= 0;
	var walkDist = 0;
	var bikeDist = 0;

	var runSum = 0;
	var walkSum = 0;
	var bikeSum = 0;

	var weekdaySum = 0;
	var weekendSum = 0;

	var weekday = 0;
	var weekend = 0;

	var weekdayAvg = 0;
	var weekendAvg = 0;

	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "completed_event") {
			if (tweet_array[i].activityType == "run") {
				runSum += tweet_array[i].distance;
			} else if (tweet_array[i].activityType == "walk") {
				walkSum += tweet_array[i].distance;
			} else if (tweet_array[i].activityType == "bike") {
				bikeSum += tweet_array[i].distance;
			}
			if (tweet_array[i].time.getDay() == 0 || tweet_array[i].time.getDay() == 6) {
				weekendSum += tweet_array[i].distance;
				weekend++;
			} else {
				weekdaySum += tweet_array[i].distance;
				weekday++;
			}
		}
	}

	weekdayAvg = weekdaySum/weekday; //4.246 mi
	weekendAvg = weekendSum/weekend; //5.981 mi

	runDist = runSum/activity_map["run"]; //4.710 mi
	walkDist = walkSum/activity_map["walk"]; //2.436 mi
	bikeDist = bikeSum/activity_map["bike"]; //9.804 mi

	document.getElementById("longestActivityType").innerText = "bike";
	document.getElementById("shortestActivityType").innerText = "walk";
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";

	//remove all activity types from tweet array
	
	function isTopThree(tweet) {
		if (tweet.activityType == "run") {
			return true;
		} else if (tweet.activityType == "walk") {
			return true;
		} else if (tweet.activityType == "bike") {
			return true;
		} else {
			return false;
		}
	}

	const new_arr = tweet_array.filter((tweet) => isTopThree(tweet));
	var topThree = [];
	for (var i= 0;i < new_arr.length; i++) {
		let j = {};
		j["a"] = new_arr[i].activityType;
		j["b"] = new_arr[i].distance;
		j["c"] = new_arr[i].time;
		topThree.push(j);
	}

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": act_arr
	  },

	  //TODO: Add mark and encoding
	  "layer": [{"mark": "bar"},
	  {"mark": {"type": "text", "align": "center", "baseline":"middle", "dy": -7},
	"encoding": {"text": {"field": "b", "type":"quantitative"}}}],
		"encoding": {
			 "x": {"field": "a", "title": "activity"},
			 "y": {"field": "b", "aggregate":"average", "title":"number of tweets"}
		}

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distances of the three most tweeted-about activities.",
		"data": {
		  "values": topThree
		},
		//TODO: Add mark and encoding
		"mark": "point",
		  "encoding": {
			  "x": {"field": "c", "timeUnit": "day", "title":"time (day)"},
			  "y": {"field": "b", "type":"quantitative", "title":"distance"},
			  "color": {"field": "a", "title":"activityType"},
		  }
  
	  };

	  distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": topThree
		},
		//TODO: Add mark and encoding
		"mark": "point",
		  "encoding": {
			  "x": {"field": "c", "timeUnit":"day", "title":"time (day)"},
			  "y": {"field": "b", "aggregate": "mean", "title":"Mean of distance"}, 
			  "color": {"field": "a", "title":"activityType"},
		  }
  
	  };
	  
	  document.getElementById("aggregate").addEventListener("click", function(){
		if (document.getElementById("aggregate").textContent == "Show means") {
			document.getElementById("aggregate").innerHTML = "Show all activities";
			vegaEmbed('#distanceVis', distance_vis_agg_spec, {actions:false});


		} else {
			document.getElementById("aggregate").innerHTML = "Show means";
			vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
		}
	  })


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});