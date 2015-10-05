var autoDub = {
	started: false,
	mode: "classic",
	version: "00.04",
	songtimer: null
};

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
        $("#autoDubTimer").countdown("destroy");
    }
	if (autoDub.mode == "classic") {
		$(".dubup").click();
		console.log("voted.");
	} else {
		var thetimer2 = Math.floor(thetimer/1000);
		$("#autoDubTimer").countdown({until: +thetimer2, compact: true, description: "", format: "MS"});
		autoDub.songtimer = setTimeout(function () {
           autoDub.songtimer = null;
           $(".dubup").click();
           $("#autoDubTimer").countdown("destroy");
           $("#autoDubTimer").text("");
           console.log("voted.");
        }, thetimer);
	}
};

autoDub.init = function(){
	autoDub.started = true;
	var script=document.createElement('script');
    script.id='aptimer';
    script.type='text/javascript';
    script.src='https://mxew.github.io/plugdj/jquery.countdown.min.js';
    document.body.appendChild(script);
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
		$("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.toggleMode()\" class=\"autodub-link\"><span id=\"autoDubMode\">AutoDub: "+themode+"</span> <span style=\"float:right;\" id=\"autoDubTimer\"></span></a>");
	},
	update: function(){
		var themode = autoDub.mode;
		$("#autoDubTimer").countdown("destroy");
		$("#autoDubTimer").text("");
		$("#autoDubMode").text("AutoDub: "+themode);
	}
};

autoDub.newVote = function(data){
	var username = $(".user-info-button").text();
	if (data.user.username == username && data.dubtype == "downdub"){
		//cancel the upvote if user downvoted
		clearTimeout(autoDub.songtimer);
        autoDub.songtimer = null;
        $("#autoDubTimer").countdown("destroy");
         $("#autoDubTimer").text("");
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
	$(".dubup").click();
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