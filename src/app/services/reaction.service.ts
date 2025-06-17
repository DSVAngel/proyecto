// src/app/services/reaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction, TweetReaction, TweetReactionRequest, MessageResponse } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // Reaction Types
  getAllReactionTypes(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.apiUrl}/reaction-types/all`);
  }

  getAvailableReactions(): Observable<{[key: string]: string}> {
    return this.http.get<{[key: string]: string}>(`${this.apiUrl}/reaction-types/available`);
  }

  initializeDefaultReactions(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/reaction-types/init`, {}, this.getHttpOptions());
  }

  // Tweet Reactions
  getReactionsByTweet(tweetId: number): Observable<TweetReaction[]> {
    return this.http.get<TweetReaction[]>(`${this.apiUrl}/reactions/tweet/${tweetId}`);
  }

  getReactionsByUser(userId: number): Observable<TweetReaction[]> {
    return this.http.get<TweetReaction[]>(`${this.apiUrl}/reactions/user/${userId}`);
  }

  createOrUpdateReaction(request: TweetReactionRequest): Observable<TweetReaction> {
    return this.http.post<TweetReaction>(`${this.apiUrl}/reactions/create`, request, this.getHttpOptions());
  }

  removeReaction(tweetId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/reactions/tweet/${tweetId}`, this.getHttpOptions());
  }

  getReactionCount(tweetId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reactions/tweet/${tweetId}/count`);
  }

  getReactionCountByType(tweetId: number, reactionId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reactions/tweet/${tweetId}/count/${reactionId}`);
  }
}
