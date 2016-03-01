if (typeof(ploog) == "undefined") {
    var ploog = {
        started: false,
        fbLoaded: false
    };
}

ploog.username = "YM";
ploog.onValueChange = null;
ploog.init = function() {
    if (!ploog.fbLoaded) {
        $.getScript("https://cdn.firebase.com/js/client/1.1.0/firebase.js", ploog.yeho);
    } else {
        ploog.yeho();
    }
    ploog.started = true;
};

ploog.yeho = function() {
    console.log("-------------------------\nlaunching Indie Discotheque Queue\n-------------------------");
    ploog.usrname = API.getUser().username;
    ploog.fbLoaded = true;
    API.on(API.CHAT_COMMAND, ploog.command);
    ploog.queueInfo = new Firebase("https://discotheque-list.firebaseio.com/queue");
    ploog.onValueChange = ploog.queueInfo.on("value", function(snapshot) {
        ploog.queueUpdate(snapshot);
    });
    ploog.ui.build();
};

ploog.command = function(cmd){
    if (cmd == "/idlist"){
        ploog.ui.hide();
    }
};

ploog.queueUpdate = function(snapshot) {
    var data = snapshot.val();
    var queue = data.queue;
    var stage = data.stage;
    var theme = data.theme;
    var themeString = "";
    var queueString = "<br/><strong>Queue</strong><br/>";
    var stageString = "<strong>DJs</strong><br/>";
    if (theme){
        themeString += "<strong>Theme</strong><br/>"+theme+"<br/><br/>";
    }
    if (queue == "") {
        queueString += "The list is empty!<br/>";
    } else {
        var tListAry = queue.split("\\");
        if (tListAry.length) {
            for (var i = 0; i < tListAry.length; i++) {
                if (tListAry[i]) {
                    var usrname = tListAry[i].substr(tListAry[i].indexOf(" ") + 1);
                    if (usrname == ploog.usrname) {
                        queueString += "<span class=\"ploog_currentdj\">" + tListAry[i] + "</span><br/>";
                    } else {
                        queueString += tListAry[i] + "<br/>";
                    }
                }
            }
        } else {
            queueString += "The List is empty!<br/>";
        }
    }
    var djListAry = stage.split("\\");

    if (djListAry.length) {
        for (var i = 0; i < djListAry.length; i++) {
            if (djListAry[i]) {
                var lastIndex = djListAry[i].lastIndexOf(" ");
                var usrname = djListAry[i].substring(0, lastIndex);

                if (usrname == ploog.usrname) {
                    if (i == 0) {
                        stageString += "<i><span class=\"ploog_currentdj\">" + djListAry[i] + "</span></i><br/>";
                    } else {
                        stageString += "<span class=\"ploog_currentdj\">" + djListAry[i] + "</span><br/>";
                    }
                } else if (i == 0) {
                    stageString += "<i>" + djListAry[i] + "</i><br/>";
                } else {
                    stageString += djListAry[i] + "<br/>";
                }
            }
        }
    } else {
        stageString += "Nobody is DJing!";
    }

    $("#ploog_screen").html(themeString + "" + stageString + "" + queueString);

};

ploog.ui = {
    build: function() {
        $("body").prepend("<style id='ploog_styles'>.plooglink{font-weight:400;cursor:pointer;color:#fff;text-decoration:underline;}.ploog_emptyspot{color:#666;}.ploog_currentdj{color:#ffdd6f;}#ploog_screen{padding-top:10px;padding-left:4px;height:210px; overflow-y:scroll;} #ploog_ui{z-index:40; font-family:helvetica,arial,sans-serif; left:12px; font-size:12px;height:250px; position:absolute; color:#000; top:70px; width:170px; background-color:#282C35; color:#d1d1d1;} #ploog_headr{line-height:22px;background-color:#1C1F25;font-weight:700;color:#d1d1d1;padding-left:4px;padding-right:4px;}.ploogleft{float:left;}.ploogright{float:right;}.ploogclear{clear:both}</style><div id='ploog_ui'></div>");
        $("#ploog_ui").append("<div id='ploog_headr'><div class='ploogleft'>#NARF</div><div class='ploogright'><a class='plooglink' onclick='ploog.ui.hide()'>[hide]</a></div><div class='ploogclear'></div></div>");
        $("#ploog_ui").append("<div id='ploog_screen'>Loading...</div>");
        $("#ploog_ui").drags({
            handle: "#ploog_headr"
        });
    },
    destroy: function() {
        $("#ploog_styles").remove();
        $("#ploog_ui").remove();
    },
    hide: function(){
        if (!ploog.ui.hidden){
            ploog.ui.hidden = true;
            $("#ploog_ui").css('display', 'none');
            ploog.queueInfo.off("value", ploog.onValueChange);
            API.chatLog("ID List is hidden. Type /idlist to bring it back.");
        } else {
            ploog.ui.hidden = false;
            $("#ploog_ui").css('display', 'block');
            ploog.onValueChange = ploog.queueInfo.on("value", function(snapshot) {
                ploog.queueUpdate(snapshot);
            });
        }
    },
    hidden: false
}

ploog.cleanUp = function() {
    ploog.queueInfo.off("value", ploog.onValueChange);
    ploog.ui.destroy();
    $("#ploog").remove();
    ploog.started = false;
};

(function($) {
    if (typeof $.fn.drags == "undefined") {
        $.fn.drags = function(opt) {

            opt = $.extend({
                handle: "",
                cursor: "move"
            }, opt);

            if (opt.handle === "") {
                var $el = this;
            } else {
                var $el = this.find(opt.handle);
            }

            return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
                if (opt.handle === "") {
                    var $drag = $(this).addClass('draggable');
                } else {
                    var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                }
                var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                    $('.draggable').offset({
                        top: e.pageY + pos_y - drg_h,
                        left: e.pageX + pos_x - drg_w
                    }).on("mouseup", function() {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
                });
                e.preventDefault(); // disable selection
            }).on("mouseup", function() {
                if (opt.handle === "") {
                    $(this).removeClass('draggable');
                } else {
                    $(this).removeClass('active-handle').parent().removeClass('draggable');
                }
            });

        }
    } else {
        console.log("drags already exists");
    }
})(jQuery);

if (!ploog.started) {
    ploog.init();
}