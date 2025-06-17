// src/app/components/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TweetService } from '../../services/tweet.service';
import { ReactionService } from '../../services/reaction.service';
import { Tweet, User, PaginatedResponse, Reaction } from '../../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  tweets: Tweet[] = [];
  reactions: Reaction[] = [];
  newTweetContent = '';
  isLoading = false;
  isLoadingTweets = false;
  currentPage = 0;
  totalPages = 0;
  hasMorePages = false;

  constructor(
    private authService: AuthService,
    private tweetService: TweetService,
    private reactionService: ReactionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTweets();
    this.loadReactions();

    // Initialize reactions if needed
    this.initializeReactions();
  }

  loadTweets(page: number = 0): void {
    this.isLoadingTweets = true;

    this.tweetService.getAllTweets(page, 10).subscribe({
      next: (response: PaginatedResponse<Tweet>) => {
        if (page === 0) {
          this.tweets = response.content;
        } else {
          this.tweets = [...this.tweets, ...response.content];
        }

        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.hasMorePages = !response.last;
        this.isLoadingTweets = false;
      },
      error: (error) => {
        console.error('Error loading tweets:', error);
        this.isLoadingTweets = false;
      }
    });
  }

  loadReactions(): void {
    this.reactionService.getAllReactionTypes().subscribe({
      next: (reactions) => {
        this.reactions = reactions;
      },
      error: (error) => {
        console.error('Error loading reactions:', error);
      }
    });
  }

  initializeReactions(): void {
    if (this.authService.isAdmin()) {
      this.reactionService.initializeDefaultReactions().subscribe({
        next: (response) => {
          console.log('Reactions initialized:', response);
        },
        error: (error) => {
          console.error('Error initializing reactions:', error);
        }
      });
    }
  }

  createTweet(): void {
    if (this.newTweetContent.trim() && !this.isLoading) {
      this.isLoading = true;

      this.tweetService.createTweet(this.newTweetContent.trim()).subscribe({
        next: (newTweet) => {
          this.tweets.unshift(newTweet);
          this.newTweetContent = '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating tweet:', error);
          this.isLoading = false;
        }
      });
    }
  }

  loadMoreTweets(): void {
    if (this.hasMorePages && !this.isLoadingTweets) {
      this.loadTweets(this.currentPage + 1);
    }
  }

  onTweetUpdated(updatedTweet: Tweet): void {
    const index = this.tweets.findIndex(t => t.id === updatedTweet.id);
    if (index !== -1) {
      this.tweets[index] = updatedTweet;
    }
  }

  onTweetDeleted(tweetId: number): void {
    this.tweets = this.tweets.filter(t => t.id !== tweetId);
  }

  getUserInitials(user: User): string {
    return user.username.substring(0, 2).toUpperCase();
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    }
  }

  trackByTweetId(index: number, tweet: Tweet): number {
    return tweet.id;
  }
}
