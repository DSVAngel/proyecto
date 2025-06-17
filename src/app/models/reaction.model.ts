export interface Reaction {
  id: number;
  emoji: string;
  description: string;
}

export interface TweetReaction {
  id: number;
  tweetId: number;
  userId: number;
  reaction: Reaction;
  createdAt: string;
} 