'use client';

import { ExistingFriend, Friend, SearchResult } from '../../../types/friend';
import { FormEvent, useEffect, useState } from 'react';
import FriendCard, { ExistingFriendCard, FriendIncomingCard, FriendOutgoingCard, FriendResultCard } from '../../../components/FriendCard';
import { useAuth } from '../../../hooks/auth'
import axios from 'axios';

export default function Page() {
  const { user } = useAuth({ middleware: 'auth' });
  const [name, setName] = useState('');
  const [availableResults, setAvailableResults] = useState<Friend[]>([]);
  const [existingResults, setExistingResults] = useState<ExistingFriend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<Friend[]>([]);
  const [outgoing, setOutgoing] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFriends = async () => {
    try {
      const res = await axios.get<any>('/api/friends');
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

      const res = await axios.get<SearchResult>(`/api/users/search?name=${encodeURIComponent(name)}`);
      setAvailableResults(res.data.available);
      setExistingResults(res.data.existing);
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
        {/* {user.profile?.preferences && (
          <div>
            <h2>Preferences:</h2>
            <pre>{JSON.stringify(user.profile.preferences, null, 2)}</pre>
          </div>
        )} */}

        <h2>FRIENDS</h2>
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))
        ) : (
          <p>No friends yet.</p>
        )}

        {incoming.length > 0 && outgoing.length > 0 && (
          <h2>PENDING</h2>
        )}

        {incoming && incoming.length > 0 && (
          <>
            <h3>Incoming</h3>
            {incoming.map((friend) => (
              <FriendIncomingCard key={friend.id} friend={friend} />
            ))}
          </>
        )}

        {outgoing && outgoing.length > 0 && (
          <>
            <h3>Outgoing</h3>
            {outgoing.map((friend) => (
              <FriendOutgoingCard key={friend.id} friend={friend} />
            ))}
          </>
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

        {availableResults.length > 0 && (
          <>
            <h3>Available</h3>
            {availableResults.map((friend) => (
              <FriendResultCard key={friend.id} friend={friend} />
            ))}
          </>
        )}
        {existingResults.length > 0 && (
          <>
            <h3>Existing</h3>
            {existingResults.map((friend) => (
              friend.status == 'pending' ? (
                <FriendOutgoingCard key={friend.id} friend={friend} />
              ) : (
                <ExistingFriendCard key={friend.id} friend={friend} />
              )
            ))}
          </>
        )}

      </div>
    </div>
  );
}
