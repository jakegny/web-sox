import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Socket } from "phoenix-channels";
import { drawKeypoints, drawSkeleton } from "./PoseNet/utils";

function App() {
  const [badMovements, setBadMovements] = useState([]);
  const canvas = useRef(null);

  useEffect(() => {
    // phoenix-channels
    // const socket = new Socket("ws://localhost:4000/socket");
    const socket = new Socket("wss://d7b9-2601-1c2-4002-5a20-6d5c-cb23-7e8d-6e06.ngrok.io/socket")

    socket.connect();

    // Now that you are connected, you can join channels with a topic:
    const channel = socket.channel("room:2", { room_id: 2 });
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
      renderPose(resp);
    });
    // WIP: user connected to channel?
    channel.on("presence_state", (resp) => {
      // alert(JSON.stringify(resp))
    });

    channel.on("bad_movement_message", (payload) => {
      // alert(payload.data)
      setBadMovements((prevArray) => [...prevArray, payload.data]);
    });

    // const channel1 = socket.channel("room:1", { "room_id": 1});
    // channel1
    // .join()
    // .receive("ok", () => {
    //     // console.log("Joined successfully");
    // })
    // .receive("error", () => {
    //     // console.log("Unable to join", resp);
    // });
    // channel1.on('bad_movement_message', payload => {
    //   // alert(payload.data)
    //   setBadMovements(prevArray => [...prevArray, payload.data])
    // })

    // setChannel(channel)
    return () => {
      socket.disconnect();
    };
  }, []);

  const canvaseWork = (ctx, keypoints, videoWidth, videoHeight) => {
    const canvaseWorkInner = () => {
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      const skeletonColor = "aqua";
      const skeletonLineWidth = 2;
      drawKeypoints(keypoints, 0.5, skeletonColor, ctx);
      drawSkeleton(keypoints, 0.5, skeletonColor, skeletonLineWidth, ctx);
      requestAnimationFrame(canvaseWorkInner);
    };

    canvaseWorkInner();
  };

  const renderPose = (keypoints) => {
    const ctx = canvas.current.getContext("2d");
    const videoHeight = 500;
    const videoWidth = 600;
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;
    canvaseWork(ctx, keypoints, videoWidth, videoHeight);
  };

  return (
    <div className="ViewData">
      <div style={{ flex: "1" }}>
        <canvas ref={canvas} style={{ backgroundColor: "darkgray" }}></canvas>
      </div>
      <div style={{ flex: "1" }}>
        <button onClick={() => setBadMovements([])}>Clear Bad Moves</button>
        {badMovements.map((badMove) => {
          return <p>{badMove}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
