if (typeof(ploog) == "undefined") {
	var ploog = {
		started: false,
		fbLoaded: false
	};
}

ploog.onValueChange = null;
ploog.init = function(){
	if (!ploog.fbLoaded) {
		$.getScript("https://cdn.firebase.com/js/client/1.1.0/firebase.js", ploog.yeho);
	} else {
		ploog.yeho();
	}
	ploog.started = true;
};

ploog.yeho = function(){
	console.log("-------------------------\nlaunching Indie Discotheque Queue\n-------------------------");
	ploog.fbLoaded = true;
	ploog.queueInfo = new Firebase("https://discotheque-list.firebaseio.com/queue");
	ploog.onValueChange = ploog.queueInfo.on("value", function(snapshot) {ploog.queueUpdate(snapshot);});
	ploog.ui.build();
};

ploog.queueUpdate = function(snapshot){
	var data = snapshot.val();
	var queue = data.queue;
	var stage = data.stage;
	var queueString = "<br/><strong>Queue</strong><br/>";
	var stageString = "<strong>DJs</strong><br/>";
	if (queue == ""){
		queueString += "The list is empty!<br/>";
	} else {
		var tListAry = queue.split("\\");
		if (tListAry.length){
			for (var i = 0; i < tListAry.length; i++){
				if (tListAry[i]) queueString += tListAry[i]+"<br/>";
			}
		} else {
			queueString += "The List is empty!<br/>";
		}
	}
	var djListAry = stage.split("\\");

	if (djListAry.length){
		for (var i = 0; i < djListAry.length; i++){
				if (djListAry[i]){
					if (i == 0){
						stageString += "<span class=\"ploog_currentdj\">"+djListAry[i]+"</span><br/>";
					} else {
						stageString += djListAry[i]+"<br/>";
					}
				} 
			}
	} else {
		stageString += "Nobody is DJing!";
	}

	$( "#ploog_screen" ).html(stageString+""+queueString);

};

ploog.ui = {
	build: function(){
		$( "body" ).prepend("<style id='ploog_styles'>.ploog_currentdj{color:#ffdd6f;}#ploog_screen{padding-top:10px;padding-left:4px;height:210px; overflow-y:scroll;} #ploog_ui{z-index:40; font-family:helvetica,arial,sans-serif; left:12px; font-size:12px;height:250px; position:absolute; color:#000; top:70px; width:170px; background-color:#282C35; color:#d1d1d1;} #ploog_headr{line-height:22px;background-color:#1C1F25;font-weight:700;color:#d1d1d1;padding-left:4px;}</style><div id='ploog_ui'></div>");
		$( "#ploog_ui" ).append("<div id='ploog_headr'>#NARF</div>");
		$( "#ploog_ui" ).append("<div id='ploog_screen'>Loading...</div>");
		$("#ploog_ui").drags({handle:"#ploog_headr"});
	},
	destroy: function(){
		$("#ploog_styles").remove();
		$("#ploog_ui").remove();
	}
}

ploog.cleanUp = function(){
	ploog.queueInfo.off("value", ploog.onValueChange);
	ploog.ui.destroy();
	$("#ploog").remove();
	ploog.started = false;
};

(function($) {
	if (typeof $.fn.drags == "undefined"){
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
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
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }}else {console.log("drags already exists");}
})(jQuery);

if (!ploog.started){
	ploog.init();
}