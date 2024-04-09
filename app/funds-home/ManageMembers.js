"use client";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import "../components/components.css";
import { useState, useEffect, useRef } from "react";
import { RESPONSE_TYPE } from "../../api/response_type";
import useFetch from "../hooks/useFetch";

export default function ManageMembers({fundID}) {
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestError, setFriendRequestError] = useState(false);

  const [members, setMembers] = useState({
    members: [],
    managers: [],
  });

  const { error, isLoading, responseJSON } = useFetch("/api/fund/members?id=" + fundID);
  const addFriendInputRef = useRef(null);

  useEffect(() => {
    if (responseJSON) {
      setMembers(responseJSON.data);
    }
  }, [isLoading]);

  async function addFriend(event) {
    event.preventDefault();

    fetch("/api/friends/add", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("addFriend").value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status == RESPONSE_TYPE.SUCCESS) {
          setFriendRequestSent(true);

          addFriendInputRef.current.value = ""; // Changed: Clear input field after successful request
        fetchFriendsData(); // Changed: Refetch friends data to update the UI
        } else if (response.status == RESPONSE_TYPE.FAILED) {
          setFriendRequestError(true);
        }
      });
  }

  async function handleFriendRequest(id, action) {
    try {
      const response = await fetch("/api/friends/respond", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action,
        }),
      });

      const data = await response.json();

      if (data.status === RESPONSE_TYPE.SUCCESS) {
        fetchFriendsData();
      } else if (data.status === RESPONSE_TYPE.FAILED) {
        console.error("Failed to handle friend request.");
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
      // Handle error, e.g., show an error message to the user
    }
  }

  const RequestSentNotification = () => {
    return (
      <div className="toast toast-center rounded-sm pb-20">
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Friend Request Sent.</span>
        </div>
      </div>
    );
  };

  const ErrorNotification = () => {
    return (
      <div className="toast toast-center rounded-sm pb-20 w-1/5">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Username does not exist.</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let timer;
    if (friendRequestSent) {
      timer = setTimeout(() => setFriendRequestSent(false), 5000);
    }
    // Cleanup function
    return () => clearTimeout(timer);
  }, [friendRequestSent]);

  useEffect(() => {
    let timer;
    if (friendRequestError) {
      timer = setTimeout(() => setFriendRequestError(false), 5000);
    }
    // Cleanup function
    return () => clearTimeout(timer);
  }, [friendRequestError]);

  return (
    <>
      <div className="flex flex-col items-center justify-items-end w-1/5">
        <p className="font-bold text-lg text-nowrap pb-10 ">Manage Members</p>

        {/* <h3 className="font-thin py-1">Add Friends</h3> */}
        <div className="flex flex-col items-center w-64">
          <input
            type="search"
            id="addFriend"
            ref={addFriendInputRef}
            className="text-white addFriendInput interFont text-sm hover:border-white pb-5 w-1/2 py-1"
            placeholder="Enter username..."
            required
          />

          <button
            onClick={addFriend}
            className="btn animate w-1/2 block bg-amber-100 hover:bg-amber-200 rounded-full py-1 text-black"
          >
            Add
          </button>
        </div>
        <div>
          <p className="py-10 font-bold text-lg">Incoming Requests</p>
          {members.members.map((friend) => (
            <div key={friend.id} className="grid grid-cols-2">
              <p className="">{friend.firstName + " " + friend.lastName}</p>
              <div className="grid grid-cols-2  ">
                <CheckCircleIcon
                  onClick={() => handleFriendRequest(friend.id, "accept")}
                  className="w-5 h-5 cursor-pointer"
                />
                <XCircleIcon
                  onClick={() => handleFriendRequest(friend.id, "reject")}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {friendRequestSent ? <RequestSentNotification /> : <></>}
        {friendRequestError ? <ErrorNotification /> : <></>}
      </div>
    </>
  );
}