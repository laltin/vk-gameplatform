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


async function guessGame(text) {
    var game;

    var availableGames = await database.getListOfGames();
    for (let g in availableGames) {
        if (text.indexOf(availableGames[g].game_name) >= 0) {
            game = availableGames[g];
            break;
        }
    }

    return game;
}

bot.on(async function(ctx) {
    var user_id = ctx.message.from_id;

    var user = await database.getUserById(user_id);
    if (!user) {
        let name = 'Lutfi';
        user = await database.saveUserById(user_id, name);
        ctx.reply('Hi, welcome!')
    }

    var text = ctx.message.text;
    var wannaPlayAGame = await intents.checkStartIntent(text);
    if (wannaPlayAGame) {

        var game = await guessGame(text);

        if (!game) {
            ctx.reply('Tell me which game do you wanna play?');
            return;
        }

        var players = textUtils.findTaggedUsers(text);
        // TODO: check number of players is enough
        // TODO: check if all users are in our database

        var infoMessage = `Starting ${game.game_name} game with ` // TODO: add players
        ctx.reply(infoMessage);
        for (let p in players) {
            bot.sendMessage(p.id, infoMessage)
        }

        players.unshift(user_id);

        var gameCode = requireFromString(game.source);

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

    var match = await database.getMatchByUserId(user_id);
    console.log(match)
    console.log(JSON.stringify(match));
    if (!match) {
        ctx.reply("Wanna play a game? Just tell me the game and tag players");
        return;
    }

    var game = await database.getGameByName(match.game_name)
    // TODO: check if it is current users turn

    var move = intents.getMoveIntent(game.nlpEndpoint, text);
    if (!move) {
        ctx.reply("Sorry, I didn't get it. Try again");
        return;
    }
    
    var gameCode = requireFromString(game.source);
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


const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended:true});
app.post('/', jsonParser, bot.webhookCallback)

const Mustache = require('mustache');
const fs = require('fs');
const template = fs.readFileSync('game-edit.html', 'utf8');

app.get('/edit/:game', async function(req, res) {
    var name = req.params.game;
    var game = await database.getGameByName(name);
    let { minPlayers, maxPlayers, nlpEndpoint, source } = game || {};
    res.send( Mustache.render(template, { game: name, min:minPlayers, max:maxPlayers, nlp:nlpEndpoint, code:source }) );
});
app.post('/edit/:game', urlencodedParser, async function(req, res) {
    var name = req.params.game;
    var { min,max,nlp,code } = req.body;

    await database.updateGame(name, min, max, nlp, code);
    res.redirect("/edit/" + name);
});

app.listen(9999)
