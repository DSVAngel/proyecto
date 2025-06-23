// src/app/services/reaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Reaction, TweetReaction, TweetReactionRequest, MessageResponse } from '../models/models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = environment.apiUrl;

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
    return this.http.get<Reaction[]>(`${this.apiUrl}/reaction-types/all`)
      .pipe(
        tap(reactions => console.log('API Response - Reactions:', reactions)),
        catchError(error => {
          console.error('Error fetching reaction types:', error);
          // Devolver reacciones por defecto si falla la API
          return of(this.getDefaultReactions());
        })
      );
  }

  getAvailableReactions(): Observable<{[key: string]: string}> {
    return this.http.get<{[key: string]: string}>(`${this.apiUrl}/reaction-types/available`)
      .pipe(
        catchError(error => {
          console.error('Error fetching available reactions:', error);
          return of({});
        })
      );
  }

  initializeDefaultReactions(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/reaction-types/init`, {}, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Reactions initialized:', response)),
        catchError(error => {
          console.error('Error initializing reactions:', error);
          return of({ message: 'Error initializing reactions' });
        })
      );
  }

  // Tweet Reactions
  getReactionsByTweet(tweetId: number): Observable<TweetReaction[]> {
    return this.http.get<TweetReaction[]>(`${this.apiUrl}/reactions/tweet/${tweetId}`)
      .pipe(
        tap(reactions => console.log(`Reactions for tweet ${tweetId}:`, reactions)),
        catchError(error => {
          console.error(`Error fetching reactions for tweet ${tweetId}:`, error);
          return of([]);
        })
      );
  }

  getReactionsByUser(userId: number): Observable<TweetReaction[]> {
    return this.http.get<TweetReaction[]>(`${this.apiUrl}/reactions/user/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching reactions for user ${userId}:`, error);
          return of([]);
        })
      );
  }

  createOrUpdateReaction(request: TweetReactionRequest): Observable<TweetReaction> {
    console.log('Creating/updating reaction with request:', request);
    return this.http.post<TweetReaction>(`${this.apiUrl}/reactions/create`, request, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Reaction created/updated:', response)),
        catchError(error => {
          console.error('Error creating/updating reaction:', error);
          throw error;
        })
      );
  }

  removeReaction(tweetId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/reactions/tweet/${tweetId}`, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Reaction removed:', response)),
        catchError(error => {
          console.error(`Error removing reaction for tweet ${tweetId}:`, error);
          throw error;
        })
      );
  }

  getReactionCount(tweetId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reactions/tweet/${tweetId}/count`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching reaction count for tweet ${tweetId}:`, error);
          return of(0);
        })
      );
  }

  getReactionCountByType(tweetId: number, reactionId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reactions/tweet/${tweetId}/count/${reactionId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching reaction count by type for tweet ${tweetId}:`, error);
          return of(0);
        })
      );
  }

  // Método para obtener reacciones por defecto en caso de que la API falle
  private getDefaultReactions(): Reaction[] {
    return [
      { id: 1, emoji: '👍', description: 'Me gusta' },
      { id: 2, emoji: '❤️', description: 'Me encanta' },
      { id: 3, emoji: '😂', description: 'Divertido' },
      { id: 4, emoji: '😮', description: 'Increíble' },
      { id: 5, emoji: '😢', description: 'Triste' },
      { id: 6, emoji: '😡', description: 'No me gusta' }
    ];
  }

  // Método para verificar si las reacciones están disponibles
  checkReactionsAvailability(): Observable<boolean> {
    return this.http.get<Reaction[]>(`${this.apiUrl}/reaction-types/all`)
      .pipe(
        tap(reactions => console.log('Checking reactions availability:', reactions.length > 0)),
        // Map the array to a boolean indicating availability
        // Use map operator from rxjs
        // Import map at the top if not already imported
        // import { catchError, tap, map } from 'rxjs/operators';
        map(reactions => Array.isArray(reactions) && reactions.length > 0),
        catchError(error => {
          console.error('Error checking reactions availability:', error);
          return of(false);
        })
      );
  }
}
