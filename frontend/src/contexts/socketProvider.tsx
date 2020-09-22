import { disconnect } from "cluster";
import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext<SocketIOClient.Socket | null>(null);

interface ISocketProvider {
  userID: string;
  children: any;
}

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider: Function = ({
  userID,
  children,
}: ISocketProvider) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      query: `userID=${userID}`,
    });

    setSocket(newSocket);

    return () => disconnectSocket(newSocket);
  }, [userID]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const disconnectSocket: Function = (socket: SocketIOClient.Socket | null) => {
  if (socket) socket.disconnect();
};
