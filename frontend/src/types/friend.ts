export interface Friend {
  friendship_id: number;
  id: number;
  name: string;
  profile: {
    avatar: string;
  };
}

export interface ExistingFriend extends Friend {
  status: 'pending' | 'accepted';
}

export interface SearchResult {
  available: Friend[];
  existing: ExistingFriend[];
}