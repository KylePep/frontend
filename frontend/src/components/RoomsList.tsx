import { useEffect, useState } from 'react';
import { axios } from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';

export default function RoomsList() {
  const { user } = useAuth({ middleware: 'auth' });
  const [rooms, setRooms] = useState<any[]>([]);
  const router = useRouter();

  const fetchRooms = async () => {
    const res = await axios.get('/api/rooms');
    setRooms(res.data);
  };

  useEffect(() => {
    if (user?.id) fetchRooms();
  }, [user]);

  return (
    <div>
      <h2>Your Rooms</h2>
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <button key={room.id} onClick={() => router.push(`/room/${room.id}`)}>
            Room {room.id} ({room.users.map(u => u.name).join(', ')})
          </button>
        ))
      ) : (
        <p>No rooms yet</p>
      )}
    </div>
  );
}
