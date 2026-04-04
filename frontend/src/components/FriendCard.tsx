import { useState } from "react";
import { axios } from "@/lib/axios";
import { Friend } from "@/types/friend";

export default function FriendCard({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <img
        src={friend.profile?.avatar || '/default-avatar.png'}
        alt={`${friend.name} avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span>{friend.name}</span>
    </div>
  );
}

export function ExistingFriendCard({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <img
        src={friend.profile?.avatar || '/default-avatar.png'}
        alt={`${friend.name} avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span>{friend.name}</span>
      <span>Existing Friend</span>
    </div>
  );
}

export function FriendIncomingCard({ friend }: { friend: Friend }) {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptFriend = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.patch(`/api/friends/${friend.friendship_id}/accept`);
      setAccepted(true); // mark as sent
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept friend request');
    } finally {
      setLoading(false);
    }
  };
  const handleDeclineFriend = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.patch(`/api/friends/${friend.friendship_id}/decline`);
      setDeclined(true); // mark as sent
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to decline friend request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-4 border rounded">
      <div className="flex items-center gap-4">
        <img
          src={friend.profile?.avatar || '/default-avatar.png'}
          alt={`${friend.name} avatar`}
          className="w-12 h-12 rounded-full"
        />
        <span>{friend.name}</span>
      </div>
      <button
        type="button"
        onClick={handleAcceptFriend}
        disabled={loading || accepted}
        className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 disabled:opacity-50"
      >
        {accepted ? 'Accepted' : loading ? 'Accepting...' : 'Accept Friend'}
      </button>
      <button
        type="button"
        onClick={handleDeclineFriend}
        disabled={loading || declined}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {declined ? 'Declined' : loading ? 'Declining...' : 'Decline Friend'}
      </button>
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </div>
  );
}

export function FriendOutgoingCard({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 px-4 border rounded">
      <div className="flex items-center gap-4">
        <img
          src={friend.profile?.avatar || '/default-avatar.png'}
          alt={`${friend.name} avatar`}
          className="w-12 h-12 rounded-full"
        />
        <span>{friend.name}</span>
      </div>
      <span>PENDING</span>
    </div>
  );
}

export function FriendResultCard({ friend }: { friend: Friend }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddFriend = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/friends', { friend_id: friend.id });
      setAdded(true); // mark as sent
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <img
        src={friend.profile?.avatar || '/default-avatar.png'}
        alt={`${friend.name} avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span>{friend.name}</span>
      <button
        type="button"
        onClick={handleAddFriend}
        disabled={loading || added}
        className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 disabled:opacity-50"
      >
        {added ? 'Request Sent' : loading ? 'Sending...' : 'Add Friend'}
      </button>
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </div>
  );
}