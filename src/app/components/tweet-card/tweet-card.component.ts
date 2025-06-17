// src/app/components/tweet-card/tweet-card.component.ts

import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Tweet, User, Reaction, TweetReaction, Comment } from '../../models/models';
import { TweetService } from '../../services/tweet.service';
import { ReactionService } from '../../services/reaction.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit {
  @Input() tweet!: Tweet;
  @Input() reactions!: Reaction[];
  @Input() currentUser!: User | null;
  @Output() tweetUpdated = new EventEmitter<Tweet>();
  @Output() tweetDeleted = new EventEmitter<number>();

  tweetReactions: TweetReaction[] = [];
  reactionCounts: { [key: number]: number } = {};
  userReaction: TweetReaction | null = null;

  showComments = false;
  comments: Comment[] = [];
  newCommentContent = '';

  isEditing = false;
  editContent = '';

  showMenu = false;
  isLoading = false;

  constructor(
    private tweetService: TweetService,
    private reactionService: ReactionService,
    private commentService: CommentService
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.tweet-menu')) {
      this.showMenu = false;
    }
  }

  ngOnInit(): void {
    this.loadReactions();
    this.loadComments();
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  hideMenu(): void {
    this.showMenu = false;
  }

  loadReactions(): void {
    this.reactionService.getReactionsByTweet(this.tweet.id).subscribe({
      next: (reactions) => {
        this.tweetReactions = reactions;
        this.calculateReactionCounts();
        this.findUserReaction();
      },
      error: (error) => {
        console.error('Error loading tweet reactions:', error);
      }
    });
  }

  calculateReactionCounts(): void {
    this.reactionCounts = {};
    this.tweetReactions.forEach(tr => {
      const reactionId = tr.reaction.id;
      this.reactionCounts[reactionId] = (this.reactionCounts[reactionId] || 0) + 1;
    });
  }

  findUserReaction(): void {
    if (this.currentUser) {
      this.userReaction = this.tweetReactions.find(tr =>
        tr.user.id === this.currentUser!.id
      ) || null;
    }
  }

  loadComments(): void {
    this.commentService.getCommentsByTweet(this.tweet.id, 0, 5).subscribe({
      next: (response) => {
        this.comments = response.content;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  toggleReaction(reaction: Reaction): void {
    if (!this.currentUser) return;

    if (this.userReaction && this.userReaction.reaction.id === reaction.id) {
      // Remove reaction
      this.reactionService.removeReaction(this.tweet.id).subscribe({
        next: () => {
          this.loadReactions();
        },
        error: (error) => {
          console.error('Error removing reaction:', error);
        }
      });
    } else {
      // Add or update reaction
      const request = {
        tweetId: this.tweet.id,
        reactionId: reaction.id
      };

      this.reactionService.createOrUpdateReaction(request).subscribe({
        next: () => {
          this.loadReactions();
        },
        error: (error) => {
          console.error('Error creating reaction:', error);
        }
      });
    }
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.loadComments();
    }
  }

  addComment(): void {
    if (!this.newCommentContent.trim() || !this.currentUser) return;

    const request = {
      tweetId: this.tweet.id,
      content: this.newCommentContent.trim()
    };

    this.commentService.createComment(request).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.newCommentContent = '';
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.editContent = this.tweet.tweet;
    this.hideMenu();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editContent = '';
  }

  saveEdit(): void {
    if (!this.editContent.trim()) return;

    this.isLoading = true;
    this.tweetService.updateTweet(this.tweet.id, this.editContent.trim()).subscribe({
      next: (updatedTweet) => {
        this.tweet = updatedTweet;
        this.tweetUpdated.emit(updatedTweet);
        this.isEditing = false;
        this.editContent = '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating tweet:', error);
        this.isLoading = false;
      }
    });
  }

  deleteTweet(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tweet?')) {
      this.tweetService.deleteTweet(this.tweet.id).subscribe({
        next: () => {
          this.tweetDeleted.emit(this.tweet.id);
        },
        error: (error) => {
          console.error('Error deleting tweet:', error);
        }
      });
    }
    this.hideMenu();
  }

  canEdit(): boolean {
    return this.currentUser?.id === this.tweet.postedBy.id;
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

  getTotalReactions(): number {
    return Object.values(this.reactionCounts).reduce((sum, count) => sum + count, 0);
  }
}
