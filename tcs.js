//Tight Community Script (tcs)
/*=====================================

To-do: 
1) Mod Tools(kick,mute,skip,clear,etc)
2) Autowoot Control
3) 
=======================================*/
API.chatLog('tcs version: 1.0');
API.sendChat('AutoWoot Enabled'); //autowoot

setInterval(function() {
    var already_wooting = $('#woot > .top > .icon').hasClass('icon-woot-disabled');
    var trying_to_grab = $('.pop-menu.curate').is(':visible');
    var mehhed_song = $('#meh > .top > .icon').hasClass('icon-meh-disabled');

    if (true &&
        !already_wooting // not already wooting
        &&
        !trying_to_grab // not trying to grab the song
        &&
        !mehhed_song // haven't meh'd this song
    ) {
        $('#woot').click();
    }

}, 20000); //Check every 20 seconds

var afkReason = 'I am AFK right now!'; //standard afk reason
var isAFK = false; //you are standard not afk
var cmdRun = true; //for cooldown function
var AFKcooldown = true;
var currentUsername = '@' + API.getUser().username; //username of the script host

function cooldown() { //Cooldown cmds for 5s
    cmdRun = false;
    setTimeout(function() {
        cmdRun = true;
    }, 5000); //timeout cmd - sets after 5000ms cmdRun to true
}


API.on(API.CHAT_COMMAND, chatCommands);

function chatCommands(data) { //the function to respond
    var timeStamp = Date().substring(16, 24);
    var message = data; //the received message
    var fromUsername = data.un; //who sent the message
    if (isAFK === true) { //if you are afk Respond
        if (message.split(currentUsername).length > 1) { //if you are mentioned (so if @yourname is in the message)
            if (AFKcooldown === true) {

                API.sendChat('@' + fromUsername + ' [AFK] ' + afkReason + ' | I will respond when I get back!'); //respond to who @mentioned you
                AFKcooldown = false;
                setTimeout(function() {
                    AFKcooldown = true;
                }, 60000);
            }
        }
    }
    if (isAFK === true) { //Logs msgs @me in console when you are in AFK mode. 
        if (message.split(currentUsername).length > 1) { //if you are mentioned (so if @yourname is in the message)
            console.log("[" + timeStamp + "] " + fromUsername + ' > ' + message); //log the message in the console 
        }
    }
    var commandParams = data.split(' ');
    var tCommand = commandParams[0];
    switch (tCommand) {
        case "/afk":
            isAFK = true; //you are now afk
            afkReason = data.slice(5, 255); //set the afk reason
            API.sendChat('/me [AFK] ' + afkReason); //sends in chat announcement about AFK with set reason
            API.chatLog('Make sure to write /back to turn off afk mode!');
            break;
        case "/back":
            API.chatLog('Welcome back! AFK mode has been turned off.');
            isAFK = false; //you are now no longer afk
            break;
        case "/cmds":
            API.chatLog('Current commands: /afk');
            break;
        case "/lenny":
            API.sendChat('( ͡° ͜ʖ ͡°)');
            break;
        case "/shrug":
            API.sendChat("¯\_(ツ)_/¯");
            break;
        case "/tableflip":
            API.sendChat("(╯°□°）╯︵ ┻━┻")
            break;

    }
}

function GlobalCommands(data) {
    var username = data.un;
    var message = data.message;
    if (isAFK === true) { //if you are afk Respond
        if (message.indexOf(currentUsername) > -1) { //if you are mentioned (so if @yourname is in the message)
            if (AFKcooldown === true) {
                API.sendChat('@' + username + ' [AFK] ' + afkReason + ' | I will respond when I get back!'); //respond to who @mentioned you
                AFKcooldown = false;
                setTimeout(function() {
                    AFKcooldown = true
                }, 60000);
            }
            console.log("[" + new Date().toLocaleString() + "] " + username + ' > ' + message); //log the message in the console 
        }
    }

}



API.on(API.CHAT, GlobalCommands);