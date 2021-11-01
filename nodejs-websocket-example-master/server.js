var express = require('express')
var wss = require('./ws')
const WebSocket = require('ws')
var app = express()

var ws = new WebSocket('ws://localhost:40510');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/ws.html');
})

app.post('/message', (req, res) => {
  // console.log('ws', ws)
  // ws.send("hello?")
  console.log(wss.clients)
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send("WAKE UP!");
    }
  });
  res.send(200)
})

app.listen(9000, function () {
  console.log('Example app listening on port 9000!')
})
