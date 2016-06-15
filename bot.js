var TelegramBot = require('node-telegram-bot-api');
var RssFeedEmitter = require('rss-feed-emitter');
var feeder = new RssFeedEmitter();
var token = '';
var fs = require('fs')
var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to your WeatherBot\n"
  message += "Get weather update by sending /weather [your_city] command."
  bot.sendMessage(fromId, message);
});

// match /weather [whatever]
bot.onText(/\/weather (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  console.log(fromId);
  var username = msg.from.username;
  var postcode = match[1];
  var message = "Hi " + username + "\n" + "Weather today in "+postcode+"\n";
  feeder.add({
    url: 'http://gbrss.weather.gov.hk/rss/LocalWeatherForecast_uc.xml',
    refresh: 2000
  });
  feeder.on('new-item', function(item) {
    var art = JSON.stringify(item, ' ', 4);
    var artDic = JSON.parse(art);
    var title = artDic['title'];
    var description = artDic['description'];
    message += "\n==== " + title + " ====\n\n";
    message += description;
    console.log(message);
    bot.sendMessage(fromId, message);
  })
});