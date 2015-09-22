var autoDub = {
	started: false,
	version: "00.01"
}

autoDub.newSong = function(){
	$(".dubup").click();
	console.log("new song. updub triggered.");
};

autoDub.init = function(){
	$('.currentSong').bind("DOMSubtreeModified", autoDub.newSong);
	$(".dubup").click();
	console.log("autodub v"+autoDub.version+" is a go!");
};

if (!autoDub.started) autoDub.init();