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

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const dateTimeOptions = { day: 'numeric', month: 'short', year: 'numeric', ...timeOptions };
  
    // Check the difference in time between now and the timestamp
    const timeDifference = now - date;
  
    // If the timestamp is within the last 24 hours
    if (timeDifference < oneDayInMs && date.getDate() === now.getDate()) {
      // Format as time only
      return new Intl.DateTimeFormat('en-US', timeOptions).format(date);
    } else {
      // Format as date and time
      return new Intl.DateTimeFormat('en-US', dateTimeOptions).format(date);
    }
  }



  useEffect(() => {
    if (!websocket) return; // Guard against undefined websocket

    // Listen for incoming messages
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "receiveMessage" && friendSelected) {
        setChatHistory((prevHistory) => [...prevHistory, {id: Math.random().toString(16).slice(2), senderId: data.senderId, message: data.message, timestamp: data.timestamp}]);
      } else if (data.type === "") {
        
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
    const date = new Date();
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
      setChatHistory((prevHistory) => [...prevHistory, {id: Math.random().toString(16).slice(2), senderId: user.accountID, receiverId: friendSelected.id, timestamp: date.toISOString(), message: message}]);
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
      <p className = "border-b border-gray-600 font-bold px-2 py-2">{friendSelected.firstName + " " + friendSelected.lastName}</p>
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
                      src="https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1712361600&semt=sph"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  You
                  <time className="text-xs opacity-50 px-1">{formatTimestamp(msg.timestamp)}</time>
                </div>
                {/* Chat should wrap around and inside of the bubble it should not get out. */}
                <div className="chat-bubble break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{msg.message}</div>
                <div className="chat-footer opacity-50">Delivered</div>
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
                  <time className="text-xs opacity-50 px-1">{formatTimestamp(msg.timestamp)}</time>
                </div>
                {/* Chat should wrap around and inside of the bubble it should not get out. */}
                <div className="chat-bubble break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{msg.message}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef}/>
      </div>
      <div className="absolute inset-x-0 left-0 bottom-0 h-16 p-2 border-t border-gray-600">
        <form className="flex" onSubmit={handleSubmit}>
          <input
            className="focus:outline-none w-11/12 px-1 text-white bg-[#101012]"
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
