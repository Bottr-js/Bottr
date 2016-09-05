function serveWebclient(req, res) {
  res.sendFile(__dirname + '/webclient.html')
}

module.exports = serveWebclient
