var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: 40510,
    clientTracking: true
  })

wss.on('connection', function (ws, request, client) {
  ws.on('message', function (message) {
    // console.log('request', request)
    console.log('received: %s', message, 'from', client)
    // console.log(wss.clients
  })

  // setInterval(
  //   () => ws.send(`${new Date()}`),
  //   1000
  // )
})

module.exports = wss;
