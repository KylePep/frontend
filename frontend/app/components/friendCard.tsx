interface Friend {
  id: number;
  name: string;
  profile: {
    avatar: string;
  }
}

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

export function FriendResultCard({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <img
        src={friend.profile?.avatar || '/default-avatar.png'}
        alt={`${friend.name} avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span>{friend.name}</span>
      <button type='submit' className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 disabled:opacity-50">Add Friend</button>
    </div>
  );
}