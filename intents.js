module.exports = function(text) {
    var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9497d07e-9ba9-461b-b091-6479652bec4d?subscription-key=789f5de87f9d4ada92e0b393c7d579c0&timezoneOffset=-360&q=' + encodeURIComponent(text);
    
    var result = JSON.parse(text);
    
    return (result.topScoringIntent.intent == "Start Game" && result.topScoringIntent.score > 0.8);
}
