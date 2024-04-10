'use client'

import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';

export default function FriendsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);

  const { isLoading, error, responseJSON } = useFetch("/api/friends/get");

  // Set friends list when the fetch hook gets a response
  useEffect(() => {
    if (responseJSON && responseJSON.data) {
        
      setFriendsList([responseJSON.data]);
    }
  }, [responseJSON]);

  // Filter friends list based on search term
  useEffect(() => {
    const results = friendsList.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(results);
  }, [searchTerm, friendsList]);

  // Handle loading and error states in the UI
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data!</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFriends.map((friend) => (
          <li key={friend.id}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}