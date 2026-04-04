"use client";

import { useEffect, useState } from 'react';
import useEcho from "@/hooks/echo.js"
import { useAuth } from '@/hooks/auth';
import { axios } from "@/lib/axios";
import { Friend } from '@/types/friend';
import FriendCard from '@/components/FriendCard';






export default function Lobby() {
  const { user } = useAuth({ middleware: 'auth' })
  const [friends, setFriends] = useState<Friend[]>([]);
  const echo = useEcho()

  const sendTestMessage = async (id) => {
    await axios.post('/api/test-message', {
      receiver_id: id, // hardcode another user for now
      message: 'hello from websocket'
    });
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get<any>('/api/friends');
      setFriends(res.data.accepted);

    } catch (err: any) {
      // setError(err.response?.data?.message || 'Failed to load friends');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    if (!echo || !user?.id) return;

    const channel = echo.private(`chat.${user.id}`)
      .listen('.MessageSent', (event) => {
        console.log('Real-time event received:', event);
      });

    return () => {
      channel.stopListening('.MessageSent');
    };
  }, [echo, user?.id]);


  return (
    <div>
      <h1>Lobby</h1>
      <h2>FRIENDS</h2>
      {friends && friends.length > 0 ? (
        friends.map((friend) => (
          <button key={friend.id} onClick={() => sendTestMessage(friend.id)}>
            <FriendCard friend={friend} />
            Send Test Message
          </button>
        ))
      ) : (
        <p>No friends yet.</p>
      )}
    </div>
  );

}