// src/app/services/tweet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tweet, PaginatedResponse, MessageResponse } from '../models/models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = `${environment.apiUrl}/tweets`;

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

  getAllTweets(page: number = 0, size: number = 10): Observable<PaginatedResponse<Tweet>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Tweet>>(`${this.apiUrl}/all`, { params });
  }

  getTweetById(id: number): Observable<Tweet> {
    return this.http.get<Tweet>(`${this.apiUrl}/${id}`);
  }

  getTweetsByUser(userId: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Tweet>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Tweet>>(`${this.apiUrl}/user/${userId}`, { params });
  }

  createTweet(tweetContent: string): Observable<Tweet> {
    const tweet = { tweet: tweetContent };
    return this.http.post<Tweet>(`${this.apiUrl}/create`, tweet, this.getHttpOptions());
  }

  updateTweet(id: number, tweetContent: string): Observable<Tweet> {
    const tweet = { tweet: tweetContent };
    return this.http.put<Tweet>(`${this.apiUrl}/${id}`, tweet, this.getHttpOptions());
  }

  deleteTweet(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
