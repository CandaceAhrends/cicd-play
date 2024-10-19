import ActiveSocket from "./polygonSocket.mjs";
import dayjs from "dayjs";
import { WebSocketServer } from "ws";
import { normalizeCandle } from "./utils.mjs";
import dotenv from "dotenv";

dotenv.config();
const APIKEY = process.env.POLYGON_APIKEY;
const PORT = process.env.POLYGON_SOCKET_PORT;
const URL = process.env.POLYGON_SOCKET_URL;
const authenticateAction = {
  action: "auth",
  params: APIKEY,
};
console.log(`listening on port ${PORT} before connecting to polygon`);
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", async function connection(ws) {
  console.log("web socket 8082 started");
  const sendMessageFn = (msg) => {
    // console.log(msg)
    switch (msg.ev) {
      case "A":
        if (msg.c > 1 && msg.c < 150) {
          const txn = normalizeCandle(msg);
          ws.send(
            JSON.stringify({
              type: "TXN",
              ...txn,
              time: dayjs(txn.time).format("HH:mm"),
            })
          );
        }
    }
  };

  const connection = await ActiveSocket(sendMessageFn, URL);

  if (connection.connected) {
    connection.send(JSON.stringify(authenticateAction));
    const tape = { action: "subscribe", params: "A.*" };
    connection.send(JSON.stringify(tape));
  }

  wss.on("close", () => {
    console.log("Client disconnected");
  });
  wss.onerror = function () {
    console.log("Some Error occurred");
  };
});
