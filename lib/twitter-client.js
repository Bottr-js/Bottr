var OAuth = require('oauth') //FIXME: Remove this library

function TwitterClient(config) {

  var defaults = {
    key: process.env.TWITTER_KEY,
    secret: process.env.TWITTER_SECRET,
    token: process.env.TWITTER_TOKEN,
    tokensecret: process.env.TOKEN_SECRET,
  }

  this.config = Object.assign({}, defaults, config)
  this.oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    this.config.key,
    this.config.secret,
    '1.0A',
    null,
    'HMAC-SHA1'
  )

  var client = this

  return function(bot) {

    // var request = client.oauth.get("https://stream.twitter.com/1.1/statuses/filter.json?track=TrainTimesBot", client.config.token, client.config.tokensecret, null)
    //
    // data = ''
    // request.on("response", function (response) {
    //
    //   console.log('response')
    //
    //   response.on("data", function(chunk) {
    //     data += chunk
    //
    //     console.log('data')
    //
    //     if (data.indexOf('\r\n') > -1) {
    //       data = data.slice(0, data.indexOf('\r\n'))
    //       if (data.length > 0) {
    //         try {
    //           console.log(JSON.parse(data))
    //         } catch(err) {
    //           console.log("Failed to parse JSON: " + data)
    //           console.log(err)
    //         }
    //       }
    //       data = ''
    //     }
    //   })
    //
    //   response.on("error", function(data) {
    //     console.log('error ' + data)
    //   })
    // })
  }
}

// TwitterClient.prototype
// TwitterClient.prototype
// TwitterClient.prototype
// TwitterClient.prototype
// TwitterClient.prototype

module.exports = TwitterClient
