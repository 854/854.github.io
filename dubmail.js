var dubMail = {
  started: false,
  version: "0.000000000000000000022",
  queue: false,
  fromLast: "YM",
  lastChat: null,
  queueActual: []
};

dubMail.go = function(){
  $('html').append('<style id="sneakyStyles">.sneakyClose{cursor:pointer;float:right;}#Scontainer{font-family:helvetica, arial, san-serif;font-size:12px;background-color:#000; background-color:#fff; max-width:900px; margin-left:auto; margin-right:auto; min-height:100%;}#sneakyTop{line-height:45px;background-color:#888;}#sneakySide{float:left;padding-top:10px;width:175px;background-color:#ddd;height:900px;} #Scontainer button{font-family:helvetica,arial,sans-serif; color:#000;} #folderz li{margin-bottom:5px;} #Scontainer input{color:#000; background-color:#fff;} #peopleHere{height:280px; background-color:#fff; overflow-y:scroll;} #sneakyMain a{text-decoration:none; color:#000;} #sneakyPM a{text-decoration:none; color:#00f;} #sneakyMain{float:right;width:725px;height:900px;overflow-y:scroll;} #sneakyQueue{display:none;} .sneakyMail{padding:15px;cursor:pointer;} .sneakyMail:nth-child(even) { background-color: #eee; } .sneakyName, .sneakySubject, .sneakyTime {display:inline-block;overflow-x:hidden; white-space: nowrap;} .sneakyTime{width:50px; float:right; text-align:right;} .sneakyName{width:140px; margin-right:15px;}.sneakySubject{width:470px;}#sneakySearch{line-height:30px; padding:0; padding-left:10px; font-family:helvetica,arial,sans-serif; font-size:14px; width:500px;margin-left:50px;}.sneakyBoost{margin-right:7px; color:green;}.sneakyDelete{color:red;}#sneakySide a{padding-top:2px; background: transparent url(https://i.imgur.com/6XNmnlp.png) no-repeat; color: #00f; padding-left: 19px; line-height: 15px;} #peopleHere li{border-bottom:1px solid #eee; cursor: pointer; padding:4px;} #Scompose{padding:10px;}#Scompose button{width:90%;}.sneakyLogo{font-size:18px;font-weight:700;padding-left:10px;}.sneakyTop{padding:4px;background-color:#000;color:#fff}div#sneakyPM{z-index:9000;position:fixed;bottom:0;font-family:helvetica,arial,sans-serif;font-size:12px}.sneakyPMWindow{display:inline-block; width:200px;margin-left:10px;background-color:#fff;border-left:1px solid #000;border-right:1px solid #000} .sneakypmPut{font-family:helvetica,arial,sans-serif;width:100%;font-size:12px;border-top:1px solid #000;color:#000!important}.sneakyMsg{padding:5px;} .sneakyMsg:nth-child(even) { background-color: #eee; }.sneakyPmtxt{height:200px;overflow-y:scroll; overflow-x:hidden;}</style><div id="Scontainer"><div id="sneakyTop"> <span class="sneakyLogo">Real Email Client</span> <input id="sneakySearch" type="text"> <button onclick="dubMail.hide()">Search</button></div><div id="sneakySide"><div id="Scompose"><button onclick="dubMail.hide()">Send Mail</button><br/><br/><strong>Folders</strong><ul id="folderz"><li><a onclick="dubMail.toggleInbox()" style="background-position: 0px -18px" href="#">Inbox</a></li><li><a style="background-position: 0px -73px" href="#">Spam (13)</a></li><li><a style="background-position: 0px -91px" href="#">Deleted</a></li><li><a id="sneakyDJ">DJ Name</a></li><li><a id="sneakyArtist" href="#">Artist</a></li><li><a id="sneakyTrack" href="#">Track</a></li><li><a id="sneakyFav" onclick="dubMail.toggleQueue()" href="#">Favorites</a></li></ul><br/><br/><strong>Contacts</strong><ul id="peopleHere"></ul></div></div><div id="sneakyMain"><div class="sneakyMail" style="background-color:#ddd; padding:5px; padding-left:15px; font-weight:700;"><div class="sneakyName">FROM</div><div class="sneakySubject">SUBJECT</div></div><div id="sneakyInbox"></div><div id="sneakyQueue"></div></div><div style="clear:both"></div></div><div id="sneakyPM"></div>');
     $(".player_header").append("<span id=\"buttonThingThanks\" onclick=\"dubMail.unhide()\">EMAIL</span>");


    Dubtrack.Events.bind("realtime:chat-message", dubMail.newChat);
    Dubtrack.Events.bind("realtime:room_playlist-update", dubMail.newSong);
    Dubtrack.Events.bind("realtime:chat-skip", dubMail.songSkip);
    Dubtrack.Events.bind("realtime:user-leave", dubMail.userLeave);
  Dubtrack.Events.bind("realtime:user-join", dubMail.userJoin);
Dubtrack.Events.bind("realtime:new-message", dubMail.newPM);
  $("#Scontainer").show();
  $("body").hide();
 var pos = $(".queue-position").text();
    var txt = "Favorites";
    if (pos != ""){
      txt += " ("+pos+"/"+$(".queue-total").text()+")";
    }
    $("#sneakyFav").text(txt);
  $('.queue-position').bind("DOMSubtreeModified", function(){
    var pos = $(".queue-position").text();
    var txt = "Favorites";
    if (pos != ""){
      txt += " ("+pos+"/"+$(".queue-total").text()+")";
    }
    $("#sneakyFav").text(txt);
  });

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
  var djpic = $(".imgEl").find("img").attr("alt");
  $("#sneakyDJ").text(djpic);

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
          $('#peopleHere').prepend('<li onclick="dubMail.makeConvo(\''+id+'\',\''+name+'\')" id="yoits'+id+'">'+name+'</li>');
        }
            }
     });
        dubMail.started = true;
  console.log("OK THIS IS DUBMAIL VERSION "+dubMail.version);
};;

dubMail.userJoin = function(data){
  var id = data.user._id;
  var name = data.user.username;
  console.log(data);
  if (!$("#yoits"+id).length){
    $('#peopleHere').prepend('<li onclick="dubMail.makeConvo(\''+id+'\',\''+name+'\')" id="yoits'+id+'">'+name+'</li>');
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

dubMail.toggleQueue = function(){

    $("#sneakyQueue").html("");
         $.ajax({
       dataType: "json",
       type : "GET",
       url: "https://api.dubtrack.fm/user/session/room/55f82ef944809b0300f88695/queue", 
            success:  function (formatted){
              dubMail.queueActual = [];
         for (var i = 0; i<formatted.data.length; i++){
          dubMail.queueActual.push(formatted.data[i]._id);
          var songName = formatted.data[i]._song.name;
         var foo = songName.split(" - ");
 var artist = foo[0];
 var title = foo[1];
 if (!title){
  title = artist;
  artist = "Unknown";
 }
 var id = formatted.data[i]._id;
  $('#sneakyQueue').append('<div id="sneak'+id+'" class="sneakyMail"><div title="'+artist+'" class="sneakyName">'+artist+'</div><div title="'+title+'" class="sneakySubject">'+title+'</div><div class="sneakyTime"><span onclick="dubMail.boostTrack(\''+id+'\')" class="sneakyBoost">^</span> <span onclick="dubMail.deleteTrack(\''+id+'\')" class="sneakyDelete">X</span></div></div>');
        }
            $("#sneakyInbox").hide();
    $("#sneakyQueue").show();
    dubMail.queue = true;
            }
     });

  
};

dubMail.toggleInbox = function(){
    $("#sneakyInbox").show();
    $("#sneakyQueue").hide();
    $("#sneakyQueue").html("");
    dubMail.queue = false;
};

dubMail.deleteTrack = function(id){
 $.ajax({
       dataType: "json",
       type : "DELETE",
       url: "https://api.dubtrack.fm/room/55f82ef944809b0300f88695/playlist/"+id,
       success: function(data){
        console.log(data);
        $("#sneak"+id).remove();
        for (var i=0; i<dubMail.queueActual.length; i++){
          if (dubMail.queueActual[i] == id){
            dubMail.queueActual.splice(i, 1);
          }
        }
       }
     });

};

dubMail.boostTrack = function(id){
  var dataActual = "order%5B%5D="+id+"";
  for(var i=0; i<dubMail.queueActual.length;i++){
    if (dubMail.queueActual[i] !== id){
    dataActual += "&";
      dataActual += "order%5B%5D=";
    dataActual += dubMail.queueActual[i];
    }
  }
        $.ajax({
        url: "https://api.dubtrack.fm/user/session/room/55f82ef944809b0300f88695/queue/order",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: dataActual,
        success: function(data){
          console.log(data);
          var newThing = $("#sneak"+id).html();

          $("#sneak"+id).remove();

  $('#sneakyQueue').prepend('<div id="sneak'+id+'" class="sneakyMail">'+newThing+'</div>');

   for (var i=0; i<dubMail.queueActual.length; i++){
          if (dubMail.queueActual[i] == id){
            dubMail.queueActual.splice(i, 1);
          }
        }
        dubMail.queueActual.unshift(id);

        }
    });

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
 var djid = data.song._user;
 if (!title){
  title = artist;
  artist = "Unknown";
 }
setTimeout(function() {
  var djpic = $(".imgEl").find("img").attr("alt");
  $("#sneakyDJ").text(djpic);
 }, 2000);

if (djid == Dubtrack.session.id){
  if (dubMail.queue){
    dubMail.toggleQueue();
  }
}

 $("#sneakyArtist").text(artist);
 $("#sneakyTrack").text(title);

};
dubMail.closePM = function(id){
    $("#sneakText"+id).unbind("keypress");

    $("#sneakybox"+id).remove();

};
dubMail.makeConvo = function(userid,coolName){
  if ($(".pmbox"+coolName).length) return;
 var nicedata = 'usersid%5B%5D=' +userid;


                        $.ajax({
                        url: 'https://api.dubtrack.fm/message/',
                        type: 'POST',
                        data: nicedata ,
                        crossDomain: true,
                        success: function(response) {
                          message_id = response.data._id
                                      
           $.ajax({
              url: 'https://api.dubtrack.fm/message/' + message_id,
              type: 'GET',
              crossDomain: true,
              success: function(data) {
           
console.log(data);
if (!$("#sneakybox"+message_id).length){


//CREATE THE PM BOX
$('#sneakyPM').append('<div id="sneakybox'+message_id+'" class="sneakyPMWindow pmbox'+coolName+'"><div class="sneakyTop">'+coolName+' <div class="sneakyClose" onclick="dubMail.closePM(\''+message_id+'\')">x</div></div><div id="sneakTexty'+message_id+'" class="sneakyPmtxt"></div><input id="sneakText'+message_id+'" class="sneakypmPut" type="text"></div>');
  $('#sneakText'+message_id).keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
     var textValue = $(this).attr('id');
var message_id1 = textValue.substring(9, textValue.length);

    var stuff = $('#sneakText'+message_id1).val();
    console.log(message_id1);
     console.log(stuff);
    if (stuff != ""){
                     var dat = {
             "created":1450294100941,
             "message":stuff,
             "userid":"56015d872e803803000ffde6",
             "messageid":"",
             "_message":{

             },
             "_user":{
                "username":"ned_stark_reality",
                "status":1,
                "roleid":1,
                "dubs":0,
                "created":1442930054513,
                "lastLogin":0,
                "userInfo":{
                   "_id":"56015d872e803803000ffde7",
                   "locale":"en_US",
                   "userid":"56015d872e803803000ffde6",
                   "__v":0
                },
                "_force_updated":1448741219759,
                "_id":"56015d872e803803000ffde6",
                "__v":0
             }
                 };


                $.ajax({
                        url: 'https://api.dubtrack.fm/message/' + message_id1,
                        type: 'POST',
                        data: dat ,
                        crossDomain: true,
                    });
      $('#sneakText'+message_id1).val('');
    
  } }
});
  for (var i=0; i< data.data.length; i++){
    var nice = data.data[i];
   
     var msg1 = data.data[i].message;
      var user1 = data.data[i]._user.username;
      $("#sneakTexty"+message_id).prepend("<div class=\"sneakyMsg\"><strong>"+user1+":</strong> "+msg1+"</div>");

  }
  $("#sneakTexty"+message_id).scrollTop( $("#sneakTexty"+message_id)[0].scrollHeight);


} 

                                     
                },
              error: function(xhr, textStatus, errorThrown){
                 console.log('ajax pm failed :( ');
              }
          });
 
                        },
                        error: function(xhr, textStatus, errorThrown){
                            console.log(xhr);
                          }
                        });
                          
};

dubMail.newPM = function(event){
 var user_id = event.userid;
 //console.log(event);
     
       var message_id = event.messageid;
            
           $.ajax({
              url: 'https://api.dubtrack.fm/message/' + message_id,
              type: 'GET',
              crossDomain: true,
              success: function(data) {
                  var msg = data.data[0].message;
                  var user = data.data[0]._user.username;
console.log(data);
if (!$("#sneakybox"+message_id).length){


//CREATE THE PM BOX
$('#sneakyPM').append('<div id="sneakybox'+message_id+'" class="sneakyPMWindow pmbox'+user+'"><div class="sneakyTop">'+user+' <div class="sneakyClose" onclick="dubMail.closePM(\''+message_id+'\')">x</div></div><div id="sneakTexty'+message_id+'" class="sneakyPmtxt"></div><input id="sneakText'+message_id+'" class="sneakypmPut" type="text"></div>');
  $('#sneakText'+message_id).keypress(function (e) {

 var key = e.which;
 if(key == 13)  // the enter key code
  {
    var textValue = $(this).attr('id');
var message_id1 = textValue.substring(9, textValue.length);


    console.log(e);
    var stuff = $('#sneakText'+message_id1).val();
    if (stuff != ""){
                     var dat = {
             "created":1450294100941,
             "message":stuff,
             "userid":"56015d872e803803000ffde6",
             "messageid":"",
             "_message":{

             },
             "_user":{
                "username":"ned_stark_reality",
                "status":1,
                "roleid":1,
                "dubs":0,
                "created":1442930054513,
                "lastLogin":0,
                "userInfo":{
                   "_id":"56015d872e803803000ffde7",
                   "locale":"en_US",
                   "userid":"56015d872e803803000ffde6",
                   "__v":0
                },
                "_force_updated":1448741219759,
                "_id":"56015d872e803803000ffde6",
                "__v":0
             }
                 };


                $.ajax({
                        url: 'https://api.dubtrack.fm/message/' + message_id1,
                        type: 'POST',
                        data: dat ,
                        crossDomain: true,
                    });
      $('#sneakText'+message_id1).val('');
    
  } }
});
  for (var i=0; i< data.data.length; i++){
    var nice = data.data[i];
   
     var msg0 = data.data[i].message;
     var msg1 = Dubtrack.helpers.text.convertHtmltoTags(msg0);
      var user1 = data.data[i]._user.username;
      $('#sneakTexty'+message_id).prepend('<div class="sneakyMsg"><strong>'+user1+':</strong> '+msg1+'</div>');

  }
  $("#sneakTexty"+message_id).scrollTop( $("#sneakTexty"+message_id)[0].scrollHeight);
emojify.run(document.getElementById('sneakTexty'+message_id));


} else {
  var newChat = "";
  for (var i=data.data.length - 1; i>=0 ; i--){
    var nice = data.data[i];
     var msg0 = data.data[i].message;
     var msg1 = Dubtrack.helpers.text.convertHtmltoTags(msg0);
      var user1 = data.data[i]._user.username;
      $('#sneakTexty'+message_id).prepend('<div class="sneakyMsg"><strong>'+user1+':</strong> '+msg1+'</div>');

  }
  $("#sneakTexty"+message_id).html(newChat);
  $("#sneakTexty"+message_id).scrollTop( $("#sneakTexty"+message_id)[0].scrollHeight);
emojify.run(document.getElementById('sneakTexty'+message_id));


}


                                     
                },
              error: function(xhr, textStatus, errorThrown){
                 console.log('ajax pm failed :( ');
              }
          });
 
      
};

dubMail.kill = function(){
  $("#sneakyStyles").remove();
  $("#Scontainer").remove();
  $("body").show();
  $("#buttonThingThanks").remove();
  $("#dubmail1").remove();
  Dubtrack.Events.unbind("realtime:chat-message", dubMail.newChat);
    Dubtrack.Events.unbind("realtime:room_playlist-update", dubMail.newSong);
    Dubtrack.Events.unbind("realtime:chat-skip", dubMail.songSkip);
Dubtrack.Events.unbind("realtime:new-message", dubMail.newPM);
    Dubtrack.Events.unbind("realtime:user-leave", dubMail.userLeave);
    Dubtrack.Events.unbind("realtime:user-join", dubMail.userJoin);
  $("#sneakySearch").unbind("keypress");
    $(".queue-position").unbind("DOMSubtreeModified");
  dubMail = null;
};

dubMail.newChat = function(data){
  var name = data.user.username;
  var msg0 = data.message;
  var msg = Dubtrack.helpers.text.convertHtmltoTags(msg0);

  var id = data.user._id;
  var chid = data.chatid;

  if (dubMail.fromLast == id){
    var oldtext = $("#h0tmail"+dubMail.lastChat).text();
    $("#h0tmail"+dubMail.lastChat).text(oldtext+" "+msg);
    $("#h0tmail"+dubMail.lastChat).attr("title", oldtext+" "+msg);

    $("#h0ttime"+dubMail.lastChat).text(dubMail.format_time(Date.now()));
  } else {
    dubMail.lastChat = chid;
   $('#sneakyInbox').prepend('<div class="sneakyMail"><div title="'+name+'" class="sneakyName"><span style="font-weight:700;">'+name+'</span>@dubtrack.fm</div><div title="'+msg+'" id="h0tmail'+chid+'" class="sneakySubject">'+msg+'</div><div id="h0ttime'+chid+'" class="sneakyTime">'+dubMail.format_time(Date.now())+'</div></div>');
  }
  dubMail.fromLast = id;
};

dubMail.songSkip = function(data){
  var name = data.username;
  $('#sneakyInbox').prepend('<div class="sneakyMail" style="font-weight:700;"><div class="sneakyName"><span style="font-weight:700;">noreply</span>@dubtrack.fm</div><div class="sneakySubject">'+name+' skipped the song.</div><div class="sneakyTime">'+dubMail.format_time(Date.now())+'</div></div>');
};

dubMail.speak = function(txt){
  Dubtrack.room.chat._messageInputEl.val(txt);
  Dubtrack.room.chat.sendMessage();
};

if (!dubMail.started) dubMail.go();