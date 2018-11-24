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


(async function() {
console.log(await database.getListOfGames());
})();


function findGame(text) {
    var game;
    for (let g in availableGames) {
        if (text.indexOf(availableGames[g].name) >= 0) {
            game = availableGames[g];
            break;
        }
    }

    return game;
}

bot.on(async function(ctx) {
    var user_id = ctx.message.from_id;

    /*
    var user = database.getUserById(user_id);
    if (!user) {
        user = database.saveUserById(user_id, name);
        ctx.reply('Hello!')
    }*/

    var text = ctx.message.text;
    var wannaPlayAGame = await intents.checkStartIntent(text);
    if (wannaPlayAGame) {

        var availableGames = database.getListOfGames();
        var game = findGame(text);

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
        var match = database.createMatch(players, data, playerIndex);
        for (let i=0; i < players.length; i++) {
            bot.sendMessage(players[i], messages[i]);

            if (playerIndex == i) {
                bot.sendMessage(players[i], 'It is your turn, make your move');
            }
            else {
                bot.sendMessage(players[i], `It is ${players[i]}'s turn! Waiting for his/her move.`);
            }
        }

        return;
    }

    var match = database.getMatchByUserId(user_id);
    if (!match) {
        ctx.reply("Wanna play a game? Just tell me the game and tag players");
        return;
    }

    var game = findGame(match.game_name)

    var move = intents.getMoveIntent(game.nlpEndpoint, text);
    if (!move) {
        ctx.reply("Sorry, I didn't get it. Try again");
        return;
    }
    
    var gameCode = requireFromString(game.code);
    let [isValid, nextData, messages, nextPlayerIndex] = gameCode.transition(match.state, match.playerIndex, move);

    if (!isValid) {
        var reason = nextData;
        var errorMessage = "This move is not allowed. " + (reason ? reason : "")
        ctx.reply(errorMessage);
        return;
    }

    // TODO: check if game ended

    database.updateMatch(nextData, nextPlayerIndex);
    // TODO: update match if game ended
    for (let i=0; i < match.players.length; i++) {
        bot.sendMessage(match.players[i], messages[i]);

        if (nextPlayerIndex == i) {
            bot.sendMessage(match.players[i], 'It is your turn, make your move');
        }
        else {
            bot.sendMessage(match.players[i], `It is ${match.players[i]}'s turn! Waiting for his/her move.`);
        }
    }

    // TODO: send game ended messages
})


app.use(bodyParser.json())
app.post('/', bot.webhookCallback)
app.listen(9999)
