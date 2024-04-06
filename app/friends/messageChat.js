'use client'
import { useEffect, useState, useContext } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import UserContext from '../UserContext';
export default function MessageChat({ friendSelected, websocket }) {

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);


  const { user } = useContext(UserContext);


  useEffect(() => {
    if (!websocket) return; // Guard against undefined websocket

    // Listen for incoming messages
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'joinConversationResponse' && friendSelected) {
        setChatHistory(data.data);
      } else if (data.type === 'sendMessageResponse' && friendSelected) {
        setChatHistory((prevHistory) => [...prevHistory, data.message]);
      }
    };

    // Add the event listener
    websocket.addEventListener('message', handleMessage);

    // Clean up the listener when the component unmounts
    return () => {
      if (websocket) {
        websocket.removeEventListener('message', handleMessage);
      }
    };
  }, [websocket, friendSelected]);



  // Function to send a message
  const sendMessage = (message) => {
    if (message) {
      websocket.send(JSON.stringify({
        type: 'sendMessage',
        data: {
          senderId: user.accountID,
          receiverId: friendSelected.id,
          message: message
        }
      })
    );
      setMessage('');
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
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index}>{msg.senderId === user.accountID ? 'You' : friendSelected.firstName}: {msg.message}</div>
        ))}
      </div>
      <div className="absolute inset-x-0 left-0 bottom-0 h-16 p-2 border-t-2 border-slate-500">
        <form className="flex" onSubmit={handleSubmit}>
          <input
            className="focus:outline-none w-11/12 px-1 text-white bg-[#121212]"
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
