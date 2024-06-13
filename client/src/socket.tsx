import { io } from "socket.io-client";

const URL = "http://localhost:8000";
const socket = io(URL, { autoConnect: false });

declare module "socket.io-client" {
  interface Socket {
    userID?: string;
  }
}

export default socket;
