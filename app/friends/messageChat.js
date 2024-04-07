"use client";
import { useEffect, useState, useContext, useRef } from "react";
import useFetch from "../hooks/useFetch";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import UserContext from "../UserContext";
export default function MessageChat({ friendSelected, websocket }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  if (websocket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not open. readyState:", websocket.readyState);
    // return;
  }

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const [page, setPage] = useState(1);

  const { error, isLoading, responseJSON } = useFetch(
    "/api/friends/chat-history?friend=" +
      friendSelected.id +
      "&page=" +
      page +
      "&pageSize=50"
  );

  useEffect(() => {
    if (responseJSON) {
      console.log("responseJSON.data: " + responseJSON.data);
      const reversedData = [...responseJSON.data].reverse();
      setChatHistory(reversedData);
    }
  }, [isLoading]);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!websocket) return; // Guard against undefined websocket

    // Listen for incoming messages
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "receiveMessage" && friendSelected) {
        setChatHistory((prevHistory) => [...prevHistory, {id: Math.random().toString(16).slice(2), senderId: data.senderId, message: data.message}]);
      }
    };

    // Add the event listener
    websocket.addEventListener("message", handleMessage);

    // Clean up the listener when the component unmounts
    return () => {
      if (websocket) {
        websocket.removeEventListener("message", handleMessage);
      }
    };
  }, [websocket, friendSelected]);

  // Function to send a message
  const sendMessage = () => {
    if (message) {
      websocket.send(
        JSON.stringify({
          type: "sendMessage",
          data: {
            senderId: user.accountID,
            receiverId: friendSelected.id,
            message: message,
          },
        })
      );
      setChatHistory((prevHistory) => [...prevHistory, {id: Math.random().toString(16).slice(2), senderId: user.accountID, receiverId: friendSelected.id, message: message}]);
      console.log("Message Sent");
      setMessage("");
    }
  };

  // Function to handle input change
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="relative h-full">
      <p>Message Chat History with {friendSelected.firstName}</p>
      {/* Render the chat history */}
      <div  className="overflow-auto h-[33rem] snap-y">
        {chatHistory.map((msg) => (
          <div key={msg.id}>
            {msg.senderId === user.accountID ? (
              <div className="chat chat-end px-2">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  You
                  <time className="text-xs opacity-50">12:46</time>
                </div>
                <div className="chat-bubble">{msg.message}</div>
                <div className="chat-footer opacity-50">Seen at 12:46</div>
              </div>
            ) : (
              <div className="chat chat-start px-2">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {friendSelected.firstName}
                  <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">{msg.message}</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef}/>
      </div>
      <div className="absolute inset-x-0 left-0 bottom-0 h-16 p-2 border-t-2 border-slate-500">
        <form className="flex" onSubmit={handleSubmit}>
          <input
            className="focuss:outline-none w-11/12 px-1 text-white bg-[#121212]"
            placeholder="Send a message..."
            value={message}
            onChange={handleChange}
          />
          <button type="submit" className="w-1/12 pl-5">
            <PaperAirplaneIcon className="h-5 w-5 items-center" />
          </button>
        </form>
      </div>
    </div>
  );
}
