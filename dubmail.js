var dubMail = {
	started: false,
	version: "0.00000000000000000002"
};

dubMail.go = function(){
	$('html').append('<style>body{display:none;}#Scontainer{font-family:helvetica, arial, san-serif;font-size:14px;background-color:#000; background-color:#fff; max-width:900px; margin-left:auto; margin-right:auto; min-height:100%;}#sneakyTop{line-height:45px;background-color:#888;}#sneakySide{float:left;padding-top:10px;width:175px;background-color:#ddd;height:900px;} #Scontainer button{font-family:helvetica,arial,sans-serif; color:#000;} #Scontainer input{color:#000; background-color:#fff;} #sneakyMain{float:right;width:725px;height:900px;overflow-y:scroll;}.sneakyMail{padding:5px;cursor:pointer;}.sneakyName, .sneakySubject{display:inline-block;overflow-x:hidden; white-space: nowrap;}.sneakyName{width:120px;}.sneakySubject{width:520px;}.sneakyMail:nth-child(even){background-color:#eee;}#sneakySearch{line-height:30px; padding:0; padding-left:10px; font-family:helvetica,arial,sans-serif; font-size:14px; width:500px;margin-left:50px;}#Scontainer a{color:#00f;}#Scompose{padding:10px;}#Scompose button{width:90%;}.sneakyLogo{font-size:18px;font-weight:700;padding-left:10px;}</style><div id="Scontainer"><div id="sneakyTop"> <span class="sneakyLogo">Real Email Client</span> <input id="sneakySearch" type="text"> <button>Search</button></div><div id="sneakySide"><div id="Scompose"><button>Send Mail</button><br/><br/><ul><li><a href="#">Inbox</a></li><li><a href="#">Spam (13)</a></li><li><a href="#">Deleted</a></li><li><a id="sneakyArtist" href="#">Artist</a></li><li><a id="sneakyTrack" href="#">Track</a></li><li><a href="#">Favorites</a></li></ul></div></div><div id="sneakyMain"><div class="sneakyMail" style="background-color:#ddd; font-weight:700;"><div class="sneakyName">FROM</div><div class="sneakySubject">SUBJECT</div></div><div id="sneakyInbox"></div></div><div style="clear:both"></div></div>');
    Dubtrack.Events.bind("realtime:chat-message", dubMail.newChat);
    Dubtrack.Events.bind("realtime:room_playlist-update", dubMail.newSong);
    $('#sneakySearch').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
  	console.log(e);
  	var stuff = $("#sneakySearch").val();
  	if (stuff != ""){
  		dubMail.speak(stuff);
  		$("#sneakySearch").val("");
  	}
  }
}); 
        dubMail.started = true;

};

dubMail.newSong = function(data){
 var songName = data.songInfo.name;
 var foo = songName.split(" - ");
 var artist = foo[0];
 var title = foo[1];
 if (!title){
 	title = artist;
 	artist = "Unknown";
 }

 $("#sneakyArtist").text(artist);
 $("#sneakyTrack").text(title);

};

dubMail.newChat = function(data){
	var name = data.user.username;
	var msg = data.message;
	$('#sneakyInbox').prepend('<div class="sneakyMail"><div class="sneakyName">'+name+'@dubtrack.fm</div><div class="sneakySubject">'+msg+'</div></div>');
};

dubMail.speak = function(txt){
  Dubtrack.room.chat._messageInputEl.val(txt);
  Dubtrack.room.chat.sendMessage();
};

if (!dubMail.started) dubMail.go();