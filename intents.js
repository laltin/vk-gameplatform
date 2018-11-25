const fetch = require("node-fetch");

exports.getUserVKName = async function(user_id) {
    var url = "https://api.vk.com/method/users.get?user_id="+user_id+"&v=5.52&access_token=3c1948a499e060bb785162495c2e9fcac510e77497387215c6c031dd41e7a1f04cd1675af66c4de954e92";

    var response = await fetch(url);
    var result = await response.json();
    console.log(result.response)
    
    return result.response[0];
};

exports.checkStartIntent = async function(text) {
    var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a37f6242-1a6b-4a43-b984-112657e8a620?subscription-key=05cf4ff3d5cb42e9a6af6277cea6f30a&timezoneOffset=-360&q=' + encodeURIComponent(text);

    var response = await fetch(url);
    var result = await response.json();

    console.log(result.topScoringIntent.intent);
    console.log(result.topScoringIntent.score);

    return (result.topScoringIntent.intent == "Start Game" && result.topScoringIntent.score > 0);
}

let getMoveIntent = async function(url, text) {
    var url = url + encodeURIComponent(text);

    var response = await fetch(url);
    var result = await response.json();

    console.log('----- intent for ' + text);
    console.log(result.topScoringIntent.intent);
    console.log(result.topScoringIntent.score);

    if (result.topScoringIntent.intent == "None") {
        return null;
    }

    let params = {};
    if (result.entities) {
        for (let i=0; i<result.entities.length; i++) {
            params[ result.entities[i].type ] = result.entities[i].entity;
        }
    }
    return [result.topScoringIntent.intent, params];
};
exports.getMoveIntent = getMoveIntent;

exports.getGameIntent = async function(text) {
    let [move, params] = await getMoveIntent('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/7ae22e3d-4334-402d-8695-1cabebc5ef5e?subscription-key=789f5de87f9d4ada92e0b393c7d579c0&timezoneOffset=-360&q=', text)
    return move;
}
