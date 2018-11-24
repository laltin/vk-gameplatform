const fetch = require("node-fetch");

export.getUserVKName = async function(user_id) {

};

exports.checkStartIntent = async function(text) {
    var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9497d07e-9ba9-461b-b091-6479652bec4d?subscription-key=789f5de87f9d4ada92e0b393c7d579c0&timezoneOffset=-360&q=' + encodeURIComponent(text);

    var response = await fetch(url);
    var result = await response.json();

    console.log(result.topScoringIntent.intent);
    console.log(result.topScoringIntent.score);

    return (result.topScoringIntent.intent == "Start Game" && result.topScoringIntent.score > 0);
}

exports.getMoveIntent = async function(url, text) {
    var url = url + encodeURIComponent(text);

    var response = await fetch(url);
    var result = await response.json();

    console.log(result.topScoringIntent.intent);
    console.log(result.topScoringIntent.score);

    if (result.topScoringIntent.intent == "None") {
        return null;
    }

    return result.topScoringIntent.intent;
};
