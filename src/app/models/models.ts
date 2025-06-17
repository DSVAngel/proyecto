// src/app/models/models.ts

export interface User {
  id: number;
  username: string;
  email: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface Tweet {
  id: number;
  tweet: string;
  createdAt: string;
  updatedAt: string;
  postedBy: User;
  postedById?: number;
  edited?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  tweet: Tweet;
  user: User;
  parentComment?: Comment;
  tweetId?: number;
  userId?: number;
  parentCommentId?: number;
  isReply?: boolean;
}

export interface Reaction {
  id: number;
  description: string;
  emoji: string;
  name?: string;
  displayText?: string;
}

export interface TweetReaction {
  id: number;
  user: User;
  tweet: Tweet;
  reaction: Reaction;
  userId?: number;
  tweetId?: number;
  reactionId?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role?: string[];
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}

export interface CommentRequest {
  tweetId: number;
  content: string;
  parentCommentId?: number;
}

export interface TweetReactionRequest {
  tweetId: number;
  reactionId: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos de reacciones musicales
export enum MusicReaction {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY'
}

export const MUSIC_REACTION_EMOJIS = {
  [MusicReaction.LIKE]: '👍',
  [MusicReaction.LOVE]: '❤️',
  [MusicReaction.LAUGH]: '😂',
  [MusicReaction.WOW]: '😮',
  [MusicReaction.SAD]: '😢',
  [MusicReaction.ANGRY]: '😡'
};

export const MUSIC_REACTION_LABELS = {
  [MusicReaction.LIKE]: 'Me gusta',
  [MusicReaction.LOVE]: 'Me encanta',
  [MusicReaction.LAUGH]: 'Divertido',
  [MusicReaction.WOW]: 'Increíble',
  [MusicReaction.SAD]: 'Triste',
  [MusicReaction.ANGRY]: 'No me gusta'
};
