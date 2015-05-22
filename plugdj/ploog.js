if (typeof(ploog) == "undefined") {
	var ploog = {
		started: false,
		reloadURL: "https://854.github.io/plugdj/ploog.js",
		media:null,
		queueInfo: null,
		dj:null
	};
}

ploog.init = function(){
	$.getScript("https://cdn.firebase.com/js/client/1.1.0/firebase.js", ploog.yeho);
	ploog.started = true;
};

ploog.yeho = function(){
	console.log("-------------------------\nlaunching Indie Discotheque Queue\n-------------------------");
	ploog.queueInfo = new Firebase("https://discotheque-list.firebaseio.com/queue");
	ploog.queueInfo.on("value", function(snapshot) {ploog.queueUpdate(snapshot);});
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
		$( "body" ).prepend("<style id='ploog_styles'>.ploog_currentdj{color:#ffdd6f;}#ploog_screen{padding-top:10px;padding-left:4px;height:210px; overflow-y:scroll;} #ploog_ui{z-index:9; font-family:helvetica,arial,sans-serif; left:12px; font-size:12px;height:250px; position:absolute; color:#000; top:70px; width:170px; background-color:#282C35; color:#d1d1d1;} #ploog_headr{line-height:22px;background-color:#1C1F25;font-weight:700;color:#d1d1d1;padding-left:4px;}</style><div id='ploog_ui'></div>");
		$( "#ploog_ui" ).append("<div id='ploog_headr'>#NARF</div>");
		$( "#ploog_ui" ).append("<div id='ploog_screen'>Loading...</div>");
		$("#ploog_ui").draggable();
	},
	destroy: function(){
		$("#ploog_styles").remove();
		$("#ploog_ui").remove();
	}
}

ploog.reload = function(){
	ploog.cleanUp();
	setTimeout(function() {
		var script=document.createElement('script');
		script.id='ploog';
		script.type='text/javascript';
		script.src=ploog.reloadURL;
		document.body.appendChild(script);
	}, 2 * 1000);
};

ploog.cleanUp = function(){
	ploog.ui.destroy();
	$("#ploog").remove();
	ploog.started = false;
};

$.fn.draggable = function(){
    var $this = this,
    ns = 'draggable_'+(Math.random()+'').replace('.',''),
    mm = 'mousemove.'+ns,
    mu = 'mouseup.'+ns,
    $w = $(window),
    isFixed = ($this.css('position') === 'fixed'),
    adjX = 0, adjY = 0;

    $this.mousedown(function(ev){
        var pos = $this.offset();
        if (isFixed) {
            adjX = $w.scrollLeft(); adjY = $w.scrollTop();
        }
        var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
        $this.data(ns,{ x : ox, y: oy });
        $w.on(mm, function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            if (isFixed) {
                adjX = $w.scrollLeft(); adjY = $w.scrollTop();
            }
            var offset = $this.data(ns);
            $this.css({left: ev.pageX - adjX - offset.x, top: ev.pageY - adjY - offset.y});
        });
        $w.on(mu, function(){
            $w.off(mm + ' ' + mu).removeData(ns);
        });
    });

    return this;
};

if (!ploog.started){
	ploog.init();
}