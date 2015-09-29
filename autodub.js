var autoDub = {
	started: false,
	version: "00.03",
	blockInlineImages: true
}

autoDub.newSong = function(){
	var songName = $(".currentSong").text();
	if (songName == "loading...") return;
	$(".dubup").click();
	console.log("voted for "+songName);
};

autoDub.newChat = function(data){
	try{
		var url = data.message;
 		if ((url.slice(-4) == '.png') || (url.slice(-4) == '.jpg') || (url.slice(-4) == '.gif')) {
 			if (autoDub.blockInlineImages) $(".chat-main").find("p:last").html("<a href=\""+data.message+"\">"+data.message+"</a>");
 		}
	} catch (e){

	}
};

autoDub.init = function(){
	$('.currentSong').bind("DOMSubtreeModified", autoDub.newSong);
	Dubtrack.Events.bind("realtime:chat-message", autoDub.newChat);
	$(".dubup").click();
	console.log("autodub v"+autoDub.version+" is a go!");
};

if (!autoDub.started) autoDub.init();