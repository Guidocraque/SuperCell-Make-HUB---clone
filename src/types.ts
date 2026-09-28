export type GameType = 'All Games' | 'Brawl Stars' | 'Clash Royale' | 'Clash of Clans' | 'Hay Day';

export type CategoryFilter = 'FEATURED' | 'WINNERS' | 'FINALISTS' | 'MOST VOTED' | 'MOST RECENT' | 'STAFF PICKS';

export interface Creation {
  id: string;
  title: string;
  game: GameType;
  character: string;
  creator: {
    name: string;
    avatar: string;
    badge?: string;
  };
  votes: number;
  isFinalist?: boolean;
  isWinner?: boolean;
  isStaffPick?: boolean;
  thumbnail: string;
  imageAlt: string;
  accentColor: string;
  badgeType: 'Finalist' | 'Winner' | 'Staff Pick' | 'Runner Up' | 'Popular';
  description: string;
  toolsUsed: string[];
  createdAt: string;
  campaignId?: string;
  turnaroundImages?: string[];
  polyCount?: string;
}

export interface Campaign {
  id: string;
  title: string;
  game: GameType;
  character: string;
  theme: string;
  status: 'Open' | 'Closed' | 'Voting' | 'Winner Announced';
  submissionsCount: number;
  prize: string;
  deadline: string;
  bannerImage: string;
  accentGradient: string;
  description: string;
  brief: string[];
  rules: string[];
  templateDownloadUrl?: string;
}

export interface SupercellUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  gameAccounts: {
    game: string;
    tag: string;
    level: number;
  }[];
  votedCreations: string[];
  myCreations: Creation[];
}
