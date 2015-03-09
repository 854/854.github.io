/*---------------------------------------------
autopilot
a less-obvious auto-voting script for plug.dj
---------------------------------------------*/

var autopilot = {
    started: false,
    wooting: true,
    media: null,
    you: null,
    songtimer: null
};

autopilot.version = "0.02.12";

autopilot.letsgo = function(){
    autopilot.started = true;
    var script=document.createElement("script");
    script.id="aptimer";
    script.type="text/javascript";
    script.src="https://854.github.io/plugdj/jquery.countdown.min.js";
    document.body.appendChild(script);
    autopilot.events.init();
    autopilot.actions.woot();
    autopilot.actions.buttontext("Auto");
    autopilot.actions.msg("autopilot (" + autopilot.version + ") is a go.", false);
};

autopilot.events = {
    init: function(){
        API.on(API.ADVANCE, autopilot.events.newsong);
        API.on(API.CHAT_COMMAND, autopilot.events.newcommand);
        API.on(API.VOTE_UPDATE, autopilot.events.newvote);
        autopilot.you = API.getUser();
        autopilot.media = API.getMedia();
        var media1 = API.getMedia();
        if (media1) document.title = media1.author+" – "+media1.title+" | plug.dj";
    },
    newvote: function(obj){
        if (obj.user.id == autopilot.you.id){
            $("#woot").find(".label").countdown("destroy");
            clearTimeout(autopilot.songtimer);
            autopilot.songtimer = null;
            autopilot.actions.buttontext("Auto");
        }
    },
    newcommand: function(cmd){
        if (cmd == "/autopilot"){
                if (autopilot.wooting){
                    autopilot.wooting = false;
                    autopilot.actions.msg("autopilot off.", false);
                    $("#woot").find(".label").countdown("destroy");
                    clearTimeout(autopilot.songtimer);
                    autopilot.songtimer = null;
                    autopilot.actions.buttontext("Woot!");
                } else {
                    autopilot.wooting = true;
                    autopilot.actions.msg("autopilot activated.", false);
                    autopilot.actions.woot();
                    autopilot.actions.buttontext("Auto");
                }
        } else if (cmd == "/link"){
            autopilot.actions.songlink();
        }
    },
    newsong: function(data){
        if (data.media) {
            document.title = data.media.author+" – "+data.media.title+" | plug.dj";
            autopilot.media = data.media;
            var length = Math.floor(data.media.duration);
            var socks = Math.floor(Math.random() * (4 - 2 + 1) + 2);
            var thetimer = (length / socks);
            if (autopilot.songtimer != null) {
                clearTimeout(autopilot.songtimer);
                autopilot.songtimer = null;
                $("#woot").find(".label").countdown("destroy");
            }
            if (autopilot.wooting){
                if (data.dj.id == autopilot.you.id){
                    autopilot.actions.buttontext("Auto");
                } else {
                    $("#woot").find(".label").countdown({until: +thetimer, compact: true, description: "", format: "MS"});
                    autopilot.songtimer = setTimeout(function () {
                        autopilot.songtimer = null;
                        autopilot.actions.woot();
                        $("#woot").find(".label").countdown("destroy");
                        autopilot.actions.buttontext("Auto");
                    }, thetimer * 1000);
                }

            }
        } else {
            document.title = "no song playing | plug.dj";
        }
    }
};

autopilot.actions = {
    woot: function(){
        $("#woot").click();
    },
    buttontext: function(txt){
        $("#woot").find(".label").html( txt );
    },
    songlink: function(){
        var data = autopilot.media;
        if (data.format == 1){
            autopilot.actions.msg("Song link: <a href=\"https://www.youtube.com/watch?v="+data.cid+"\" target=\"blank\">youtube</a>");
        } else if (data.format == 2) {
            $.ajax({
                dataType: "jsonp",
                url: "https://api.soundcloud.com/tracks/"+data.cid+".json?client_id=27028829630d95b0f9d362951de3ba2c", 
                success:  function (response){
                    autopilot.actions.msg("Song link: <a href=\""+response.permalink_url+"\" target=\"_blank\">soundcloud</a>");
                }
            });
        }
    },
    msg: function(txt,notice){
        $( "#chat-messages" ).append( "<div class=\"cm message\"><div class=\"badge-box\"><i class=\"bdg bdg-music04\"></i></div><div class=\"msg\"><div class=\"from staff\"><span class=\"un\">AUTOPILOT</span></div><div class=\"text\">"+txt+"</div></div></div>");
        var wtf = $('#chat-messages');
        var height = wtf[0].scrollHeight;
        wtf.scrollTop(height);
    }
};

autopilot.cleanUp = function(){
    API.off(API.DJ_ADVANCE, autopilot.events.newsong);
    API.off(API.CHAT_COMMAND, autopilot.events.newcommand);
    API.off(API.VOTE_UPDATE, autopilot.events.newvote);
    autopilot.wooting = false;
    autopilot.actions.msg("autopilot killed.", false);
    $("#woot").find(".label").countdown("destroy");
    clearTimeout(autopilot.songtimer);
    autopilot.songtimer = null;
    autopilot.actions.buttontext("Woot!");
    $("#plugautopilot").remove();
    $("#aptimer").remove();
    autopilot = null;
};

if (!autopilot.started) {
    autopilot.letsgo();
}