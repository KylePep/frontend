"use client";

import { useEffect, useState } from 'react';
import useEcho from "@/hooks/echo.js"
import { useAuth } from '@/hooks/auth';
import { axios } from "@/lib/axios";
import { Friend } from '@/types/friend';
import FriendCard from '@/components/FriendCard';
import { useRouter } from 'next/navigation';
import RoomsList from '@/components/RoomsList';





export default function Lobby() {
  const { user } = useAuth({ middleware: 'auth' })
  const [friends, setFriends] = useState<Friend[]>([]);
  const echo = useEcho()
  const router = useRouter();



  const createRoom = async (friendId: number) => {
    try {
      const res = await axios.post('/api/rooms', {
        user_id: friendId,
      });

      const room = res.data;
      console.log('Room created:', room);

      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  const joinRoomChannel = (roomId: number) => {
    if (!echo) return;

    const channel = echo.private(`room.${roomId}`)
      .listen('.RoomMessageSent', (event) => {
        console.log('Room event: ', event);
      });

    return channel;
  }

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
      .listen('.RoomCreated', (event: any) => {
        console.log('Invited to room:', event.room);
      });

    return () => {
      channel.stopListening('.RoomCreated');
    };
  }, [echo, user?.id]);


  return (
    <div>
      <div>
        <h1>Lobby</h1>
        <h2>FRIENDS</h2>
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className='flex'>
              <FriendCard friend={friend} />
              <button onClick={() => createRoom(friend.id)}
                className='bg-sky-300 hover:bg-sky-600 hover:text-white rounded-lg px-4 py-2 font-bold duration-100'
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p>No friends yet.</p>
        )}
      </div>
      <div>
        <RoomsList />
      </div>
    </div >
  );

}