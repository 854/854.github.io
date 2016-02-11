var dubMail = {
	started: false,
	version: "0.000000000000000000013"
};

dubMail.go = function(){
	$('html').append('<style id="sneakyStyles">body{display:none;}#Scontainer{font-family:helvetica, arial, san-serif;font-size:12px;background-color:#000; background-color:#fff; max-width:900px; margin-left:auto; margin-right:auto; min-height:100%;}#sneakyTop{line-height:45px;background-color:#888;}#sneakySide{float:left;padding-top:10px;width:175px;background-color:#ddd;height:900px;} #Scontainer button{font-family:helvetica,arial,sans-serif; color:#000;} #folderz li{margin-bottom:5px;} #Scontainer input{color:#000; background-color:#fff;} #peopleHere{height:280px; background-color:#fff; overflow-y:scroll;} #sneakyMain{float:right;width:725px;height:900px;overflow-y:scroll;}.sneakyMail{border-bottom:1px solid #eee; padding:5px;cursor:pointer;} #peopleHere li:nth-child(even) { background-color:#eee; } .sneakyName, .sneakySubject, .sneakyTime {display:inline-block;overflow-x:hidden; white-space: nowrap;} .sneakyTime{width:50px; float:right; text-align:right;} .sneakyName{width:140px; margin-right:10px;}.sneakySubject{width:470px;}#sneakySearch{line-height:30px; padding:0; padding-left:10px; font-family:helvetica,arial,sans-serif; font-size:14px; width:500px;margin-left:50px;}#Scontainer a{padding-top:2px; background: transparent url(https://i.imgur.com/6XNmnlp.png) no-repeat; color: #00f; padding-left: 19px; line-height: 15px;} #peopleHere li{cursor: pointer; padding:4px;} #Scompose{padding:10px;}#Scompose button{width:90%;}.sneakyLogo{font-size:18px;font-weight:700;padding-left:10px;}</style><div id="Scontainer"><div id="sneakyTop"> <span class="sneakyLogo">Real Email Client</span> <input id="sneakySearch" type="text"> <button onclick="dubMail.hide()">Search</button></div><div id="sneakySide"><div id="Scompose"><button onclick="dubMail.kill()">Send Mail</button><br/><br/><strong>Folders</strong><ul id="folderz"><li><a style="background-position: 0px -18px" href="#">Inbox</a></li><li><a style="background-position: 0px -73px" href="#">Spam (13)</a></li><li><a style="background-position: 0px -91px" href="#">Deleted</a></li><li><a id="sneakyArtist" href="#">Artist</a></li><li><a id="sneakyTrack" href="#">Track</a></li><li><a href="#">Favorites</a></li></ul><br/><br/><strong>Contacts</strong><ul id="peopleHere"></ul></div></div><div id="sneakyMain"><div class="sneakyMail" style="background-color:#ddd; font-weight:700;"><div class="sneakyName">FROM</div><div class="sneakySubject">SUBJECT</div></div><div id="sneakyInbox"></div></div><div style="clear:both"></div></div>');
     $(".player_header").append("<span onclick=\"dubMail.unhide()\">EMAIL</span>");

    Dubtrack.Events.bind("realtime:chat-message", dubMail.newChat);
    Dubtrack.Events.bind("realtime:room_playlist-update", dubMail.newSong);
    Dubtrack.Events.bind("realtime:chat-skip", dubMail.songSkip);
    Dubtrack.Events.bind("realtime:user-leave", dubMail.userLeave);
  Dubtrack.Events.bind("realtime:user-join", dubMail.userJoin);
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

        $.ajax({
      dataType: "json",
      type: "GET",
      url: "https://api.dubtrack.fm/room/55f82ef944809b0300f88695/playlist/active", //TODO: make bot get roomid of current room and use that
      success: function(things) {
        var data = things.data;
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
      }
    });

      $.ajax({
       dataType: "json",
       type : "GET",
       url: "https://api.dubtrack.fm/room/55f82ef944809b0300f88695/users", 
            success:  function (formatted){
				 for (var i = 0; i<formatted.data.length; i++){
				 	var id = formatted.data[i]._user._id;
				 	var name = formatted.data[i]._user.username;
				 	$('#peopleHere').prepend('<li onclick="dubMail.sneakyMention(\''+name+'\')" id="yoits'+id+'">'+name+'</li>');
 				}
            }
     });
        dubMail.started = true;
  console.log("OK THIS IS DUBMAIL VERSION "+dubMail.version);
};

dubMail.userJoin = function(data){
	var id = data.user._id;
  var name = data.user.username;
  console.log(data);
	if (!$("#yoits"+id).length){
		$('#peopleHere').prepend('<li onclick="dubMail.sneakyMention(\''+name+'\')" id="yoits'+id+'">'+name+'</li>');
	}
};


dubMail.hide = function(){
  $("body").show();
  $("#Scontainer").hide();
};

dubMail.unhide = function(){
  $("body").hide();
  $("#Scontainer").show();
};

dubMail.sneakyMention = function(name){
  var input = $("#sneakySearch").val();
  if (input == ""){
    $("#sneakySearch").val("@"+name+" ");
  } else {
    $("#sneakySearch").val(input+" @"+name+" ");
  }
};

    dubMail.format_time = function(d) {
   
        var date = new Date(d);
        
        var hours1 = date.getHours();
        var ampm = "am";
        var hours = hours1;
        if (hours1 > 12) {
            ampm = "pm";
            hours = hours1 - 12;
        }
        if (hours == 0) hours = 12;
        var minutes = date.getMinutes();
        var min = "";
        if (minutes > 9) {
            min += minutes;
        } else {
            min += "0" + minutes;
        }
        return hours + ":" + min;
    }

dubMail.userLeave = function(data){
	var id = data.user._id;
  	var name = data.user.username;

	if ($("#yoits"+id).length){
		$('#yoits'+id).remove();
	}
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

dubMail.kill = function(){
	$("#sneakyStyles").remove();
	$("#Scontainer").remove();
	$("#dubmail1").remove();
	Dubtrack.Events.unbind("realtime:chat-message", dubMail.newChat);
    Dubtrack.Events.unbind("realtime:room_playlist-update", dubMail.newSong);
    Dubtrack.Events.unbind("realtime:chat-skip", dubMail.songSkip);
    Dubtrack.Events.unbind("realtime:user-leave", dubMail.userLeave);
  	Dubtrack.Events.unbind("realtime:user-join", dubMail.userJoin);
	$("#sneakySearch").unbind("keypress");
	delete dubMail;
};

dubMail.newChat = function(data){
	var name = data.user.username;
	var msg = data.message;
	$('#sneakyInbox').prepend('<div class="sneakyMail"><div title="'+name+'" class="sneakyName">'+name+'@dubtrack.fm</div><div title="'+msg+'" class="sneakySubject">'+msg+'</div><div class="sneakyTime">'+dubMail.format_time(Date.now())+'</div></div>');
};

dubMail.songSkip = function(data){
  var name = data.username;
  $('#sneakyInbox').prepend('<div class="sneakyMail" style="font-weight:700;"><div class="sneakyName">noreply@dubtrack.fm</div><div class="sneakySubject">'+name+' skipped the song.</div><div class="sneakyTime">'+dubMail.format_time(Date.now())+'</div></div>');
};

dubMail.speak = function(txt){
  Dubtrack.room.chat._messageInputEl.val(txt);
  Dubtrack.room.chat.sendMessage();
};

if (!dubMail.started) dubMail.go();
