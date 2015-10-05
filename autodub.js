var autoDub = {
	started: false,
	mode: "classic",
	version: "00.03",
	songtimer: null
}

autoDub.newSong = function(data){
	if (data.startTime !== -1) return;
	var duration = data.songInfo.songLength;
	var length = Math.floor(duration);
    var whatever = Math.random() * (4 - 2 + 1) + 2;
    var thetimer = Math.floor(length / whatever);
    console.log(thetimer / 1000);
    if (autoDub.songtimer != null) {
        clearTimeout(autoDub.songtimer);
        autoDub.songtimer = null;
    }
	if (autoDub.mode == "classic") {
		$(".dubup").click();
		console.log("voted.");
	} else {
		autoDub.songtimer = setTimeout(function () {
           autoDub.songtimer = null;
           $(".dubup").click();
           console.log("voted.");
        }, thetimer);
	}
};

autoDub.init = function(){
	autoDub.storage.restore();
	Dubtrack.Events.bind("realtime:room_playlist-update", autoDub.newSong);
	Dubtrack.Events.bind("realtime:room_playlist-dub", autoDub.newVote);
	$(".dubup").click();
	console.log("autodub v"+autoDub.version+" is a go!");
};

autoDub.ui = {
	init: function(mode){
		var themode = autoDub.mode;
		if (mode) themode = mode;
		$("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.toggleMode()\" class=\"autodub-link\">AutoDub: "+themode+"</a>");
	},
	update: function(){
		var themode = autoDub.mode;
		$(".autodub-link").text("AutoDub: "+themode);
	}
};

autoDub.newVote = function(data){
	var username = $(".user-info-button").text();
	if (data.user.username == username && data.dubtype == "downdub"){
		//cancel the upvote if user downvoted
		clearTimeout(autoDub.songtimer);
        autoDub.songtimer = null;
        console.log("autovote off until next song.");
	}
};

autoDub.toggleMode = function(){
	if (autoDub.mode == "classic"){
		autoDub.mode = "timer";
	} else {
		autoDub.mode = "classic";
	}
	autoDub.ui.update();
	autoDub.storage.save();
};

autoDub.storage = {
	save: function(){
		var save_file = {
			mode: autoDub.mode,
			autoVote: autoDub.autoVote
		};
		var preferences = JSON.stringify(save_file);
		localStorage["autoDub"] = preferences;
	},
	restore: function(){
		var favorite = localStorage["autoDub"];
 		if (!favorite) return;
 		var preferences = JSON.parse(favorite);
 		$.extend(autoDub, preferences);
 		autoDub.ui.init(preferences.mode);
	}
};

if (!autoDub.started) autoDub.init();