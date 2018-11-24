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
        let name = (await intents.getUserVKName(user_id)).first_name;
        user = await database.saveUserById(user_id, name);
        ctx.reply('Hi, welcome!')
    }

    var text = ctx.message.text;
    var wannaPlayAGame = await intents.checkStartIntent(text);
    if (wannaPlayAGame) {
        console.log('wanna play a new game');

        var game = await guessGame(text);
        // TODO: guess game according to reachekksss ******

        if (!game) {
            ctx.reply('Tell me which game do you wanna play?');
            return;
        }

        var players = textUtils.findTaggedUsers(text);
        var n = players.length + 1;
        if (n < game.minPlayers || n > game.maxPlayers) {
            let nnn = game.minPlayers == game.maxPlayers ? game.minPlayers : `${game.minPlayers} to ${game.maxPlayers}`
            ctx.reply(`${game.game_name} requires ${nnn} players.`);
            return;
        }
        // TODO: check if all users are in our database

        var infoMessage = `Starting ${game.game_name} game with ` // TODO: add players
        ctx.reply(infoMessage);
        for (let p in players) {
            bot.sendMessage(players[p], infoMessage)
        }

        players.unshift(user_id);

        var gameCode = requireFromString(game.source);

        const [data, messages, playerIndex] = gameCode.init(players.length);
        var match = await database.createMatch(game.game_name, players, JSON.stringify(data), playerIndex);
        console.log(players);
        for (let i=0; i < players.length; i++) {
            console.log('player: ' + players[i] + '  ' + messages[i]);
            bot.sendMessage(players[i], messages[i]);

            if (playerIndex == i) {
                bot.sendMessage(players[i], 'It is your turn, make your move');
            }
            else {
                let name = (await database.getUserById(players[playerIndex])).name;
                console.log(name);
                bot.sendMessage(players[i], `It is ${name}'s turn! Waiting for his/her move.`);
            }
            console.log('message sent');
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

    if (match.players[match.active_player] !== user_id+"") {
        let name = (await database.getUserById(match.players[match.active_player])).name;
        ctx.reply(`It is ${name}'s turn. Wait for him/her to make a move.`);
        return;
    }

    var move = await intents.getMoveIntent(game.nlpEndpoint, text);
    console.log(move);
    if (!move) {
        ctx.reply("Sorry, I didn't get it. Try again");
        return;
    }
    
    var gameCode = requireFromString(game.source);
    let [isValid, nextData, messages, nextPlayerIndex] = gameCode.transition(JSON.parse(match.state), match.active_player, move);

    if (!isValid) {
        var reason = nextData;
        var errorMessage = "This move is not allowed. " + (reason ? reason : "")
        ctx.reply(errorMessage);
        return;
    }

    //console.log('new data: '+JSON.stringify(nextData));
    //console.log('nextplayer:' + nextPlayerIndex);
    //console.log(typeof nextPlayerIndex);
    const hasEnded = gameCode.hasEnded(nextData);

    await database.updateMatch(match._id, JSON.stringify(nextData), nextPlayerIndex, hasEnded ? true : false);

    // TODO: update match if game ended
    for (let i=0; i < match.players.length; i++) {
        bot.sendMessage(match.players[i], messages[i]);

        if (hasEnded) {
            continue;
        }

        if (nextPlayerIndex == i) {
            bot.sendMessage(match.players[i], 'It is your turn, make your move');
        }
        else {
            let name = (await database.getUserById(match.players[nextPlayerIndex])).name;
            bot.sendMessage(match.players[i], `It is ${name}'s turn! Waiting for his/her move.`);
        }
    }

    console.log('hasEnded: ' + hasEnded);
    if (hasEnded) {
        for (let i=0; i < match.players.length; i++) {
            bot.sendMessage(match.players[i], hasEnded[i]);
        }
    }
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
