var autoDub = {
	started: false,
	version: "00.02"
}

autoDub.newSong = function(){
	var songName = $(".currentSong").text();
	if (songName == "loading...") return;
	$(".dubup").click();
	console.log("voted for "+songName);
};

autoDub.init = function(){
	$('.currentSong').bind("DOMSubtreeModified", autoDub.newSong);
	$(".dubup").click();
	console.log("autodub v"+autoDub.version+" is a go!");
};

if (!autoDub.started) autoDub.init();