var autoDub = {
    started: false,
    mode: "classic",
    version: "00.07",
    whatsNew: "Fixed a bug that broke Classic mode after the dubtrack.fm redesign.",
    firstMessage:"AutoDub has TWO modes. Classic mode and Timer mode. Classic mode upvotes right away when each song starts. Timer mode upvotes at a random time during the song. Toggle between the two modes in the dubtrack.fm left menu (the menu with the link to the lobby and stuff).",
    lastLoaded: null,
    roomCheck: null,
    songtimer: null,
    userid: null,
    toolTip: null,
    lastSong: null
};

autoDub.versionMessage = function () {
    if (autoDub.lastLoaded == autoDub.version) {
        var msg = "<li style=\"font-weight:700; color:cyan; text-transform:none; font-size:14px;\" class=\"system\">[AutoDub] v" + autoDub.version + " is running in " + autoDub.mode + " mode.</li>";
    } else if (!autoDub.lastLoaded){
        var newStuff = "<span style=\"font-weight:700; color:cyan;\">[AutoDub] Welcome to AutoDub v" + autoDub.version + "</span><br/>";
        autoDub.lastLoaded = autoDub.version;
        autoDub.storage.save();
        newStuff += autoDub.firstMessage;
        var msg = "<li style=\"color:#eee; font-weight:400;text-transform:none; font-size:14px;\" class=\"system\">" + newStuff + "</li>";
    } else {
        var newStuff = "<span style=\"font-weight:700; color:cyan;\">[AutoDub] New in v" + autoDub.version + "</span><br/>";
        autoDub.lastLoaded = autoDub.version;
        autoDub.storage.save();
        newStuff += autoDub.whatsNew;
        var msg = "<li style=\"color:#eee; font-weight:400;text-transform:none; font-size:14px;\" class=\"system\">" + newStuff + "</li>";
    }
    $(".chat-main").append(msg);
};

autoDub.newSong = function (data) {
    console.log(data);
    if (data.song.songid == autoDub.lastSong && autoDub.mode == "timer") return;
    autoDub.lastSong = data.song.songid;
    var duration = data.songInfo.songLength;
    var length = Math.floor(duration);
    var whatever = (Math.random() * 4) + 1;
    var thetimer = Math.floor(length / whatever);
    if (autoDub.songtimer != null) {
        clearTimeout(autoDub.songtimer);
        autoDub.songtimer = null;
        $("#autoDubTimer").countdown("destroy");
    }
    if (autoDub.mode == "classic") {
        $(".dubup").click();
        console.log("voted.");
    } else {
        console.log(thetimer / 1000);
        var thetimer2 = Math.floor(thetimer / 1000);
        $("#autoDubTimer").countdown({
            until: +thetimer2,
            compact: true,
            description: "",
            format: "MS"
        });
        autoDub.songtimer = setTimeout(function () {
            autoDub.songtimer = null;
            $("#autoDubTimer").countdown("destroy");
            $("#autoDubTimer").text("");
            $(".dubup").click();
            console.log("voted.");
        }, thetimer);
    }
};

autoDub.init = function () {
    autoDub.started = true;
    var script = document.createElement('script');
    script.id = 'aptimer';
    script.type = 'text/javascript';
    script.src = 'https://854.github.io/jquery.countdown.min.js';
    document.body.appendChild(script);
    autoDub.storage.restore();
    Dubtrack.Events.bind("realtime:room_playlist-update", autoDub.newSong);
    Dubtrack.Events.bind("realtime:room_playlist-dub", autoDub.newVote);
    $(".dubup").click();
    console.log("autodub v" + autoDub.version + " is a go!");
};

autoDub.idmode = {
    discoball: {
        create: function(){
            $(".right_section").prepend("<div id=\"discoball\" style=\"pointer-events: none; background: transparent url(http://i.imgur.com/Bdn4yrg.gif) no-repeat center top; display: block; width: 100%; height:300px;position: absolute;left: 5;z-index: 6;margin-top: -320px;\"></div>");
        },
        up: function(){
            $("#discoball").animate({'margin-top': '-320px'}, 2000);
        },
        down: function(){
            $("#discoball").animate({'margin-top': '-50px'}, 5000);
        }
    },
    fb: null,
    onValueChange: null,
    onDiscoballChange: null,
    theBank: null,
    theRoomShit: null,
    userid: null,
    init: function(){
        autoDub.idmode.getName();
    },
    getUserId: function(username){
         $.ajax({
            dataType: "json",
            type: "GET",
            url: "https://api.dubtrack.fm/user/"+username,
            success: function(things) {
                var data = things.data;
                var userid = data.userInfo.userid;
                autoDub.idmode.userid = userid;
                autoDub.idmode.startFirebase();
            }
        });
    },
    startFirebase: function(){
        $.getScript("https://cdn.firebase.com/js/client/1.1.0/firebase.js", autoDub.idmode.initFirebase);
    },
    initFirebase: function(){
        autoDub.idmode.fb = new Firebase("https://discocheques.firebaseio.com");
        autoDub.idmode.theBank = autoDub.idmode.fb.child("bank/"+autoDub.idmode.userid);
        autoDub.idmode.theRoomShit = autoDub.idmode.fb.child("roomshit");
        autoDub.idmode.onValueChange = autoDub.idmode.theBank.on("value", function(snapshot) {
            autoDub.idmode.balchange(snapshot);
        });
        autoDub.idmode.onDiscoballChange = autoDub.idmode.theRoomShit.on("value", function(snapshot) {
            autoDub.idmode.roomShitChange(snapshot);
        });
    },
    roomShitChange: function(snapshot){
        var data = snapshot.val();
        if (data.discoball){
            autoDub.idmode.discoball.down();
        } else {
            autoDub.idmode.discoball.up();
        }
    },
    balchange: function(snapshot){
        var data = snapshot.val();
        if (data){
            var bal = data.bal;
        } else {
            var bal = 0;
        }

        $("#discobal").text("Balance: "+bal+" discocheques");
    },
    getName: function(){
        var username = $(".user-info").text();
        if (username == ""){
            setTimeout(function() {
                autoDub.idmode.getName();
            }, 3000);
        } else {
            autoDub.idmode.getUserId(username);
        }
    }
};

autoDub.ui = {
    init: function (mode) {
        var themode = autoDub.mode;
        if (mode) themode = mode;
        autoDub.roomCheck = setInterval(function () {
            if (window.location.href.match(/\/join\//)) {
                autoDub.versionMessage();
                clearInterval(autoDub.roomCheck);
                autoDub.roomCheck = null;
            }
        }, 2000);
        $("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.toggleMode()\" class=\"autodub-link\"><span id=\"autoDubMode\">AutoDub: " + themode + "</span> <span style=\"float:right;\" id=\"autoDubTimer\"></span></a>");
        autoDub.ui.toolTips();
        $('.autodub-link').hover(function () {
            $('<p class="tooltip" style="max-width:150px;opacity:0.7;z-index:1000000;position:absolute;padding:5px;background-color:cyan;color:#000;font-size:14px;font-weight:700;"></p>')
                .text(autoDub.toolTip)
                .appendTo('body');
        }, function () {
            $('.tooltip').remove();
        }).mousemove(function (e) {
            var mousex = e.pageX + 20;
            var mousey = e.pageY + 10;
            $('.tooltip')
                .css({
                    top: mousey,
                    left: mousex
                })
        });
        if (window.location.href.match(/\/join\/indie-discotheque/)) {
            $(".right_section").css( "margin-top", "10px" );
            $(".right_section").prepend("<div id=\"discobal\" style=\"position: absolute; margin-top: -20px; font-size: 14px;\">Loading your Discocheque balance...</div>");
            autoDub.idmode.discoball.create();
            setTimeout(function() {
                autoDub.idmode.init();
            }, 1000);
        }
   
    },
    update: function () {
        var themode = autoDub.mode;
        $("#autoDubTimer").countdown("destroy");
        $("#autoDubTimer").text("");
        $("#autoDubMode").text("AutoDub: " + themode);
        autoDub.ui.toolTips();
    },
    toolTips: function () {
        if (autoDub.mode == "classic") {
            autoDub.toolTip = 'AutoDub is in classic mode. This autovotes at the beginning of each song. Click to change modes.';
        } else if (autoDub.mode == "timer") {
            autoDub.toolTip = 'AutoDub is in timer mode. This autovotes at a random time during each song. Click to change modes.';
        }
        if ($(".tooltip").text()) $(".tooltip").text(autoDub.toolTip);
    }
};

autoDub.newVote = function (data) {
    var username = $(".user-info").text();
    if (data.user.username == username) {
        //cancel the upvote if user voted
        if (autoDub.songtimer != null) {
            clearTimeout(autoDub.songtimer);
            autoDub.songtimer = null;
            $("#autoDubTimer").countdown("destroy");
            $("#autoDubTimer").text("");
            console.log("autovote off until next song.");
        }
    }
};

autoDub.toggleMode = function () {
    if (autoDub.mode == "classic") {
        autoDub.mode = "timer";
    } else {
        autoDub.mode = "classic";
    }
    autoDub.ui.update();
    $(".dubup").click();
    autoDub.storage.save();
};

autoDub.storage = {
    save: function () {
        var save_file = {
            mode: autoDub.mode,
            autoVote: autoDub.autoVote,
            lastLoaded: autoDub.lastLoaded
        };
        var preferences = JSON.stringify(save_file);
        localStorage["autoDub"] = preferences;
    },
    restore: function () {
        var favorite = localStorage["autoDub"];
        if (!favorite) {
            autoDub.ui.init();
            autoDub.storage.save();
            return;
        }
        console.log("autodub settings found.");
        var preferences = JSON.parse(favorite);
        $.extend(autoDub, preferences);
        autoDub.ui.init(preferences.mode);
    }
};

if (!autoDub.started) autoDub.init();