var autoDub = {
	started: false,
	version: "00.06",
	blockInlineImages: true,
	autoVote: true
}

autoDub.newSong = function(){
	var songName = $(".currentSong").text();
	if (songName == "loading...") return;
	$(".dubup").click();
	console.log("voted for "+songName);
};

autoDub.newChat = function(data){
	try{
		var splitMsg = data.message.split(' ');
		var msg = data.user.username + ": ";
		var len = splitMsg.length;
		for(var i = 0 ; i <  len; i++)
		{
			if ((splitMsg[i].indexOf('.png') > -1) || (splitMsg[i].indexOf('.jpg') > -1) || (splitMsg[i].indexOf('.gif') > -1) || (splitMsg[i].indexOf('.jpeg') > -1)){
				splitMsg[i] = "<a class=\"autolink\" target=\"_blank\" href=\""+splitMsg[i]+"\">"+splitMsg[i]+"</a>";
			}
			msg += splitMsg[i] + " " ;
		}
 		if (autoDub.blockInlineImages) $(".chat-main").find("p:last").html(msg);
	} catch (e){

	}
};

autoDub.storage = {
	save: function(){
		var save_file = {
			blockInlineImages: autoDub.blockInlineImages,
			autoVote: autoDub.autoVote
		};
		var preferences = JSON.stringify(save_file);
		localStorage["autoDub"] = preferences;
	},
	restore: function(){
		var favorite = localStorage["autoDub"];
 		if (!favorite) {
 			var onOff = "ON";
			if (autoDub.blockInLineImages) onOff = "OFF";
			$("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.toggleInline()\" class=\"autodub-link\">[ADub] Chat Images: "+onOff+"</a>");
			autoDub.storage.save();
    		return;
 		}
 		var preferences = JSON.parse(favorite);
 		$.extend(autoDub, preferences);
 		var onOff = "ON";
		if (preferences.blockInlineImages) onOff = "OFF";
		$("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.toggleInline()\" class=\"autodub-link\">[ADub] Chat Images: "+onOff+"</a>");
	}
};

autoDub.toggleInline = function(){
	if (autoDub.blockInlineImages){
		autoDub.blockInlineImages = false;
		$(".autodub-link").text("[ADub] Chat Images: ON");
	} else {
		autoDub.blockInlineImages = true;
		$(".autodub-link").text("[ADub] Chat Images: OFF");
	}
	autoDub.storage.save();
};

autoDub.init = function(){
	autoDub.storage.restore();
	$('.currentSong').bind("DOMSubtreeModified", autoDub.newSong);
	Dubtrack.Events.bind("realtime:chat-message", autoDub.newChat);
	$(".dubup").click();
	console.log("autodub v"+autoDub.version+" is a go!");
};

if (!autoDub.started) autoDub.init();