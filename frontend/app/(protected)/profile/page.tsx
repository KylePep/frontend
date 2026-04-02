'use client';

import FriendCard, { FriendIncomingCard, FriendOutgoingCard, FriendResultCard } from '@/app/components/friendCard';
import { useAuthContext } from '@/context/AuthContext';
import { ensureCsrf } from '@/lib/csrf';
import { get } from '@/lib/request';
import { FormEvent, useEffect, useState } from 'react';

interface Friend {
  friendship_id: number;
  id: number;
  name: string;
  profile: {
    avatar: string;
  }
}

export default function Page() {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [friendResults, setFriendResults] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<Friend[]>([]);
  const [outgoing, setOutgoing] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFriends = async () => {
    try {
      await ensureCsrf();

      const res = await get<any>('/api/friends'); // we'll define this
      setFriends(res.data.accepted);
      setIncoming(res.data.incoming);
      setOutgoing(res.data.outgoing);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load friends');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFriends();
    }
  }, [user]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await ensureCsrf();

      const res = await get<Friend[]>(`/api/users/search?name=${encodeURIComponent(name)}`);
      setFriendResults(res.data)
      setName('');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find user');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen gap-8 p-4">
      {/* Profile Info */}
      <div className="flex-1 flex flex-col gap-4">
        <h1>{user.name}'s Profile</h1>
        <img
          src={user.profile?.avatar || '/default-avatar.png'}
          alt={`${user.name} avatar`}
          className="w-32 h-32 rounded-full"
        />
        <p>{user.profile?.bio || 'No bio yet.'}</p>
        {user.profile?.preferences && (
          <div>
            <h2>Preferences:</h2>
            <pre>{JSON.stringify(user.profile.preferences, null, 2)}</pre>
          </div>
        )}

        <h2>FRIENDS</h2>
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))
        ) : (
          <p>No friends yet.</p>
        )}
        <h2>PENDING</h2>
        <h3>Incoming</h3>
        {incoming && incoming.length > 0 ? (
          incoming.map((friend) => (
            <FriendIncomingCard key={friend.id} friend={friend} />
          ))
        ) : (
          <p>No friends yet.</p>
        )}
        <h3>Outgoing</h3>
        {outgoing && outgoing.length > 0 ? (
          outgoing.map((friend) => (
            <FriendOutgoingCard key={friend.id} friend={friend} />
          ))
        ) : (
          <p>No friends yet.</p>
        )}
      </div>

      {/* Friends List */}
      <div className="flex-1 flex flex-col gap-2">
        <h2>Friends</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-2 p-4 border border-sky-300 rounded-xl">
          <input
            type="text"
            placeholder="Friend's Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button type='submit' className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 disabled:opacity-50">Search</button>
        </form>

        {friendResults.length > 0 ? (
          friendResults.map((friend) => (
            <FriendResultCard key={friend.id} friend={friend} />
          ))
        ) : (
          <p>Search results.</p>
        )}

      </div>
    </div>
  );
}
