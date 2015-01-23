/*---------------------------------------------
autopilot
a less-obvious auto-voting script for plug.dj
---------------------------------------------*/

var autopilot = {
     started: false,
    wooting: true,
    you: null,
    songtimer: null
};

autopilot.version = "0.02.01";

autopilot.letsgo = function(){
    autopilot.started = true;
    var script=document.createElement('script');
    script.id='aptimer';
    script.type='text/javascript';
    script.src='https://dl.dropboxusercontent.com/u/45661700/countr.js';
    document.body.appendChild(script);
    autopilot.events.init();
    autopilot.actions.woot();
    autopilot.actions.buttontext("Auto");
    API.chatLog("autopilot (" + autopilot.version + ") is a go.", false);
};

autopilot.events = {
    init: function(){
        API.on(API.DJ_ADVANCE, autopilot.events.newsong);
        API.on(API.CHAT_COMMAND, autopilot.events.newcommand);
        API.on(API.VOTE_UPDATE, autopilot.events.newvote);
        autopilot.you = API.getUser();
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
                    API.chatLog('autopilot off.', false);
                    $("#woot").find(".label").countdown("destroy");
                    clearTimeout(autopilot.songtimer);
                    autopilot.songtimer = null;
                    autopilot.actions.buttontext("Woot!");
                } else {
                    autopilot.wooting = true;
                    API.chatLog('autopilot activated.', false);
                    autopilot.actions.woot();
                    autopilot.actions.buttontext("Auto");
                }
        }
    },
    newsong: function(data){
        if (data.media) {
            document.title = data.media.author+" – "+data.media.title+" | plug.dj";
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
    }
};

autopilot.cleanUp = function(){
    API.off(API.DJ_ADVANCE, autopilot.events.newsong);
    API.off(API.CHAT_COMMAND, autopilot.events.newcommand);
    API.off(API.VOTE_UPDATE, autopilot.events.newvote);
    autopilot.wooting = false;
    API.chatLog('autopilot killed.', false);
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