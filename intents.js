const fetch = require("node-fetch");

exports.getUserVKName = async function(user_id) {
    var url = "https://api.vk.com/method/users.get?user_id=517947866&v=5.52&access_token=3c1948a499e060bb785162495c2e9fcac510e77497387215c6c031dd41e7a1f04cd1675af66c4de954e92";

    var response = await fetch(url);
    console.log(response);
    var result = await response.json();
    console.log(result);

    return result.response;
};

exports.checkStartIntent = async function(text) {
    var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b7a01841-6f8d-4338-9113-a4ca3cdea349?subscription-key=789f5de87f9d4ada92e0b393c7d579c0&timezoneOffset=-360&q=' + encodeURIComponent(text);

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
