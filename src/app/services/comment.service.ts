// src/app/services/comment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentRequest, PaginatedResponse, MessageResponse } from '../models/models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiUrl + '/comments';

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

  getCommentsByTweet(tweetId: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Comment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/tweet/${tweetId}`, { params });
  }

  getRepliesByComment(commentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${commentId}/replies`);
  }

  getCommentsByUser(userId: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Comment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/user/${userId}`, { params });
  }

  createComment(request: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/create`, request, this.getHttpOptions());
  }

  updateComment(commentId: number, request: CommentRequest): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, request, this.getHttpOptions());
  }

  deleteComment(commentId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${commentId}`, this.getHttpOptions());
  }

  getCommentCount(tweetId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/tweet/${tweetId}/count`);
  }
}
