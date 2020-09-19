import io from "socket.io-client";

export let socket: SocketIOClient.Socket;

export const initateSocket: Function = (userID: String) => {
  socket = io("http://localhost:5000", { query: `userID=${userID}` });
  socket.emit("start");
};

export const disconnectSocket: Function = () => {
  if (socket) socket.disconnect();
};
