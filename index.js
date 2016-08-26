var Pozi = require('./lib')

function Client() {

}

var bot = new Pozi.Bot2()

// bot.use(<component>)

// bot.on(<event>, <cb>)

bot.hears(/.+/, function(){
  console.log('I heard something')
})

bot.listen(3000)

//module.exports = require('./lib')
