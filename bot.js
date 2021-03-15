var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    if (message.substring(0, 32) == 'https://www.youtube.com/watch?v=') {
        var videoid = message;
        var matches = videoid.match(/^https?:\/\/www\.youtube\.com\/.*[?&]v=([^&]+)/i) || videoid.match(/^https?:\/\/youtu\.be\/([^?]+)/i);
        if (matches) {
            videoid = matches[1];
        }
        if (videoid.match(/^[a-z0-9_-]{11}$/i) === null) {
            return;
        }
        $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
                key: "AIzaSyBGHfsccCfvAHA6o9vGxq6tNaMBZZM2iTM",
                part: "snippet",
                id: videoid
				}, function(data) {
                    logger.info("Video Posted: Running function");
					if (data.items.length == 0) {
						logger.info('Video not found');
						return;
                    }
                    var title = data.items[0].snippet.title;
                    if (title.includes("Shapiro") || (title.includes("Jordan") && title.includes("Peterson")) || title.includes("SHAPIRO") || (title.includes("JORDAN") && title.includes("PETERSON"))){
                        bot.deleteMessage({
                            channelID: channelID,
                            messageID: evt.d.id
                        });
                        logger.info("Deleted message with content " + data.items[0]);
                    }
                })
     }
});