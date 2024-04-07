"use client";
import { useEffect, useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import "../components/components.css";
import MessageChat from "./messageChat";

export default function Messaging( { websocket }) {

  
  const [messages, setMessages] = useState([]);


  /* useEffect(() => {
    // Listen for messages
    websocket.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Clean up the listener when the component unmounts
    return () => {
      websocket.onmessage = null;
    };
  }, [websocket]); */


  const [friendsInfo, setFriendsInfo] = useState({
    receivedRequests: [],
    sentRequests: [],
    friends: [],
    blocked: [],
  });

  const [userSelected, setUserSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { error, isLoading, responseJSON } = useFetch(
    "/api/friends/get-friends"
  );

  useEffect(() => {
    if (responseJSON) {
      setFriendsInfo(responseJSON.data);
    }
  }, [responseJSON]);

  // useMemo will ensure that the filteredFriends computation is memorized
  // and only recalculated when friends list or search term changes.
  const filteredFriends = useMemo(() => {
    const result = friendsInfo.friends.filter((friend) =>
      (`${friend.firstName} ${friend.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Set the first user as selected by default whenever the filtered list changes
    if (result.length > 0 && userSelected === null) {
      setUserSelected(result[0]);
    }
    return result;
  }, [friendsInfo.friends, searchTerm]);


  // Handle the search input change.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Click handler for friend selection.
  const handleFriendClick = (friend) => {
    setUserSelected(friend);
  };

  // Render each friend item as clickable and pass the friend object on click.
  const renderFriendList = () => {
    return filteredFriends.map((friend) => (
      <div
        className="font-light p-2 text-white cursor-pointer"
        key={friend.id}
        onClick={() => handleFriendClick(friend)}
      >
        {friend.firstName + " " + friend.lastName}
        <p className="divider my-0"></p>
      </div>
    ));
  };

  if (error) {
    return <div>Error loading friends: {error.message}</div>;
  }

  return (
    <div className="w-4/5 flex border-2 border-slate-500 rounded-md h-[40rem]">
      <div className="w-2/6 border-r-2 border-slate-500">
        <p className="text-center border-b-2 border-slate-500 w-full">
          <input
            className="focus:outline-none w-full text-white p-2 bg-[#121212]"
            placeholder="Search for a friend..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </p>
        {renderFriendList()}
      </div>
      <div className="w-full">
        <p>Messaging</p>
        {userSelected && <MessageChat friendSelected={userSelected} websocket={websocket} />}

      </div>
    </div>
  );
}