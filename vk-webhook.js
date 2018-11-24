const express = require('express')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')

const app = express()
const bot = new VkBot({
  token: "3c1948a499e060bb785162495c2e9fcac510e77497387215c6c031dd41e7a1f04cd1675af66c4de954e92",
  confirmation: "87ec2d40",
})


const textUtils = require('./textUtil.js');
const intents = require('./intents.js');

bot.on(async function(ctx) {
    var user_id = ctx.message.from_id;

    /*
    var user = database.getUserById(user_id);
    if (!user) {
        user = database.saveUserById(user_id);
        ctx.reply('Hi, welcome!')
    }*/

    var text = ctx.message.text;
    var wannaPlayAGame = await intents.checkStartIntent(text);
    if (wannaPlayAGame) {
        ctx.reply("I see that you wanna play a game");
        /*
        var player = textUtils.findTaggedUsers(text);
        var game = game.init();
        game = database.createGame(user, players, game.data);
        */
    }
    
    //console.log(JSON.stringify(ctx.message));

    ctx.reply('Hello!')
})


app.use(bodyParser.json())
app.post('/', bot.webhookCallback)
app.listen(9999)
