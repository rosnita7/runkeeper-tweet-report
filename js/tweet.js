"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        if (this.text.startsWith("Just") && (this.text.includes("completed") || this.text.includes("completed"))) {
            return "completed_event";
        }
        else if (this.text.includes("Achieved")) {
            return "achievement";
        }
        else if (this.text.startsWith("Watch") && this.text.includes("right now")) {
            return "live_event";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        var p_text = this.text;
        if (p_text.includes("Check")) {
            return false;
        }
        return true;
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        this.text = this.text.substring(0, this.text.length - 35);
        return this.text;
    }
    //part 2
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let parsed_text = this.text.substring(0, 50).split(" ");
        if (parsed_text.includes("mtn")) {
            return parsed_text[6];
        }
        else if (parsed_text.includes("km")) {
            return "run";
        }
        else if (parsed_text.includes("MySports")) {
            return "run";
        }
        else if (parsed_text.includes("chair")) {
            return parsed_text[6];
        }
        else if (parsed_text.includes("nordic")) {
            return parsed_text[6];
        }
        else if (parsed_text.includes("Freestyle")) {
            return parsed_text[4];
        }
        else if (parsed_text.includes("yoga meditation")) {
            return parsed_text[3];
        }
        return parsed_text[5];
    }
    get distance() {
        let parsed_text = this.text.substring(0, 50).split(" ");
        if (this.source != 'completed_event' || parsed_text.includes("yoga")) {
            return 0;
        }
        var distance_str = parsed_text[3];
        var distance = parseFloat(distance_str);
        if (parsed_text.includes("km")) {
            distance = distance * .62;
            return distance;
        }
        else if (parsed_text.includes("mi")) {
            return distance;
        }
        else {
            return 0;
        }
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var table_num = rowNumber.toString();
        var act_type = "";
        //grabs activity type
        if (this.source != 'completed_event') {
            act_type = "unknown";
        }
        let parsed_text = this.text.substring(0, 50).split(" ");
        if (parsed_text.includes("mtn")) {
            act_type = parsed_text[6];
        }
        else if (parsed_text.includes("km")) {
            act_type = "run";
        }
        else if (parsed_text.includes("MySports")) {
            act_type = "run";
        }
        else if (parsed_text.includes("chair")) {
            act_type = parsed_text[6];
        }
        else if (parsed_text.includes("nordic")) {
            act_type = parsed_text[6];
        }
        else if (parsed_text.includes("Freestyle")) {
            act_type = parsed_text[4];
        }
        else if (parsed_text.includes("yoga meditation")) {
            act_type = parsed_text[3];
        }
        else {
            act_type = parsed_text[5];
        }
        //grabs parsed tweet.
        var link = this.text.split(" ");
        var clickable_link = "";
        var p_text = "";
        for (var i = 0; i < link.length; i++) {
            if (link[i].includes("https:")) {
                clickable_link = link[i];
                break;
            }
            p_text += link[i] + " ";
        }
        clickable_link = clickable_link.link(clickable_link);
        return "<tr>" + "<td>" + table_num + "</td>"
            + "<td>" + act_type + "</td>" +
            "<td>" + p_text + " " + clickable_link + "</td>" +
            "</tr>";
    }
}
