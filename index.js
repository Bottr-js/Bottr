var Pozi = require('./lib')

function Client() {

}

var bot = new Pozi.Bot2()

// bot.use(<component>)

// bot.on(<event>, <cb>)

// bot.hears(<pattern>, <cb>)

bot.listen(3000)

//module.exports = require('./lib')
