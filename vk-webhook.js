const express = require('express')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')

const app = express()
const bot = new VkBot({
  token: "3c1948a499e060bb785162495c2e9fcac510e77497387215c6c031dd41e7a1f04cd1675af66c4de954e92",
  confirmation: "87ec2d40",
})

bot.on((ctx) => {
    console.log('received');
    ctx.reply('Hello!')
})

app.use(bodyParser.json())
//app.post('/', bot.webhookCallback)
app.post('/', function(req, res){
  res.send('hello world');
});
app.listen(9999)
