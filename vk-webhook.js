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
const database = require('./database.js');
const requireFromString = require('require-from-string');


bot.on(async function(ctx) {
    var user_id = ctx.message.from_id;

    /*
    var user = database.getUserById(user_id);
    if (!user) {
        user = database.saveUserById(user_id, name);
        ctx.reply('Hi, welcome!')
    }*/

    var text = ctx.message.text;
    var wannaPlayAGame = await intents.checkStartIntent(text);
    if (wannaPlayAGame) {

        var availableGames = database.getListOfGames();
        var game;
        for (let g in availableGames) {
            if (text.indexOf(g.name) >= 0) {
                game = g;
                break;
            }
        }

        if (!game) {
            ctx.reply('Tell me which game do you wanna play?');
            return;
        }

        var players = textUtils.findTaggedUsers(text);
        // TODO: check number of players is enough
        // TODO: check if all users are in our database

        var infoMessage = `Starting ${game.name} game with ` // TODO: add players
        ctx.reply(infoMessage);
        for (let p in players) {
            bot.sendMessage(p.id, infoMessage)
        }

        players.unshift(user_id);

        var gameCode = requireFromString(game.code);

        const [data, messages, playerIndex] = gameCode.init(players.length);
        for (let i=0; i < players.length; i++) {
            bot.sendMessage(players[i], messages[i]);

            if (playerIndex == i) {
                bot.sendMessage(players[i], 'It is your turn');
            }
            else {
                bot.sendMessage(players[i], `It is ${player[i]}'s turn`);
            }
        }

        var match = database.createMatch(players, data, playerIndex);
    }
    
    //console.log(JSON.stringify(ctx.message));

    ctx.reply('Hello!')
})


app.use(bodyParser.json())
app.post('/', bot.webhookCallback)
app.listen(9999)
