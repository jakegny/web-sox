import {useEffect, useState} from 'react';
import { Socket } from "phoenix-channels";
import * as tfjs from '@tensorflow/tfjs'; // Don't remove this line!
import './App.css';
import PoseNet from './PoseNet'

function App() {

    const [channel, setChannel] = useState(null)
    const [badMovements, setBadMovements] = useState([])

    useEffect(() => {
      console.log('effect running...')
  
      // phoenix-channels
      const socket = new Socket("ws://localhost:4000/socket");
  
      socket.connect();
  
      // Now that you are connected, you can join channels with a topic:
      const channel = socket.channel("room:1", { "room_id": 1});
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
        alert(JSON.stringify(resp))
      });
      channel.on('bad_movement_message', payload => {
        // alert(payload.data)
        setBadMovements(prevArray => [...prevArray, payload.data])
      })
        // WIP: user connected to channel?
        channel.on('presence_state', (resp) => {
        // alert(JSON.stringify(resp))
      })
  
      setChannel(channel)
      return () => {
        // ws.close();
        // channel.le;
        socket.disconnect();
      };
    }, []);

  return (
    <div className="App">
      <div style={{flex: '1', }}>
          <PoseNet
            channel={channel}
            videoWidth={600}

            videoHeight={500}

            flipHorizontal={false}

            algorithm={'single-pose'}

            mobileNetArchitecture={1.01}

            showVideo={false}

            showSkeleton={true}

            showPoints={true}

            minPoseConfidence={0.1}

            minPartConfidence={0.5}

            maxPoseDetections={2}

            nmsRadius={20.0}

            outputStride={16}

            imageScaleFactor={0.5}

            skeletonColor={'aqua'}

            skeletonLineWidth={2}

            loadingText={'Loading pose detector...'} />
        </div>
        
          <div style={{flex: '1', }}>
            <button onClick={() => setBadMovements([])}>Clear Bad Moves</button>
            {badMovements.map(badMove => {
              return <p>{badMove}</p>;
            })}
          </div>
          {/* <button onClick={() => {
            // ws.send("Hello server!");
            // console.log("sample", sample);
            channel.push('myEvent', { test: "data" }, 10000) // what does 10000 do?

              // .receive("ok", (msg) => console.log("created message", msg) )
              .receive("error", (reasons) => console.log("create failed", reasons))
              .receive("timeout", (e) => console.log("Networking issue...", e));
          } }>Send Message</button> */}
    </div>
  );
}

export default App;
