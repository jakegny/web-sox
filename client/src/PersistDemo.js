import './App.css';
import {useEffect, useState } from 'react';
import { Socket } from "phoenix-channels";

function App() {

const [channel, setChannel] = useState(null)

useEffect(() => {
    console.log('effect running...')

    // phoenix-channels
    const socket = new Socket("ws://localhost:4000/socket");
    // const socket = new Socket("wss://7b36-2601-1c2-4002-5a20-b86c-123-b48e-3ec0.ngrok.io/socket")

    socket.connect();

    // Now that you are connected, you can join channels with a topic:
    const channel = socket.channel("room:1234", { "room_id": 1234});
    channel
    .join()
    .receive("ok", () => {
        // console.log("Joined successfully");
    })
    .receive("error", () => {
        // console.log("Unable to join", resp);
    });
    channel.on("myEvent", (resp) => {
      // do stuff with event.
      // console.log("resp", resp);
      // Alert.alert("Message", JSON.stringify(resp));
      // console.log(JSON.stringify(resp))
    });
    // WIP: user connected to channel?
    channel.on('presence_state', (resp) => {
    // alert(JSON.stringify(resp))
    })

    setChannel(channel)
    return () => {
    socket.disconnect();
    };
}, []);


  return (
    <div className="ViewData">
        <p>something</p>
    </div>
  );
}

export default App;
