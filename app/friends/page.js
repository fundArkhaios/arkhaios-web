'use client'
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import FriendsList from "./friendsList";
import ModifyFriends from "./modifyFriends";
import Messaging from "./messaging";

export default function Page() {


  const [websocket, setWebsocket] = useState(new WebSocket("wss://local.test:3000/message-handler"));


  return (
    <div className="flex p-10">
      <Messaging websocket={websocket}/>
      <ModifyFriends/>
    </div>
  );
}
