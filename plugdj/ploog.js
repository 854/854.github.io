if (typeof(ploog) == "undefined") {
	var ploog = {
		started: false,
		reloadURL: "https://854.github.io/plugdj/ploog.js",
		media:null,
		dj:null
	};
}

ploog.init = function(){
	console.log("-------------------------\nwtf is ploog?\nlaunching ploog.\n-------------------------");
	ploog.api.init();
	ploog.ui.build();
	ploog.started = true;
};

ploog.api = {
	init: function(){
		ploog.api.fill();
		API.on(API.CHAT, ploog.api.newchat);
		API.on(API.CHAT_COMMAND, ploog.api.newcmd);
		API.on(API.DJ_ADVANCE, ploog.api.newsong);
		API.on(API.USER_JOIN, ploog.api.newuser);
		API.on(API.USER_LEAVE, ploog.api.newexit);
		API.on(API.VOTE_UPDATE, ploog.api.newvote);
		API.on(API.CURATE_UPDATE, ploog.api.newheart);
		API.on(API.WAIT_LIST_UPDATE, ploog.api.waitlistupdate);
	},
	fill: function(){
		ploog.media = API.getMedia();
		ploog.dj = API.getDJ();
	},
	newcmd: function(cmd){
		if (cmd == "/reload"){
			console.log("killing ploog.");
			ploog.reload();
		}
	},
	newchat: function(data){

	},
	newsong: function(data){

	},
	newuser: function(data){

	},
	newexit: function(data){

	},
	newvote: function(data){

	},
	newheart: function(data){

	},
	waitlistupdate: function(data){

	}
};

ploog.ui = {
	build: function(){
		$( "body" ).prepend("<style id='ploog_styles'>#ploog_screen{padding-top:10px;padding-left:4px;height:108px; overflow-y:scroll;} #ploog_ui{z-index:9; font-family:helvetica,arial,sans-serif; left:12px; font-size:12px;height:140px; position:absolute; color:#000; top:70px; width:170px; background-color:#282C35; color:#d1d1d1;} #ploog_headr{line-height:22px;background-color:#1C1F25;font-weight:700;color:#d1d1d1;padding-left:4px;}</style><div id='ploog_ui'></div>");
		$( "#ploog_ui" ).append("<div id='ploog_headr'>ploog</div>");
		$( "#ploog_ui" ).append("<div id='ploog_screen'>welcome</div>");
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
	API.off(API.CHAT, ploog.api.newchat);
	API.off(API.DJ_ADVANCE, ploog.api.newsong);
	API.off(API.USER_JOIN, ploog.api.newuser);
	API.off(API.USER_LEAVE, ploog.api.newexit);
	API.off(API.VOTE_UPDATE, ploog.api.newvote);
	API.off(API.CURATE_UPDATE, ploog.api.newheart);
	API.off(API.WAIT_LIST_UPDATE, ploog.api.waitlistupdate);
	ploog.ui.destroy();
	$("#ploog").remove();
	ploog.started = false;
};

if (!ploog.started){
	ploog.init();
}