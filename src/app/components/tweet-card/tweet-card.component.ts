// src/app/components/tweet-card/tweet-card.component.ts

import { Component, Input, Output, EventEmitter, OnInit, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { Tweet, User, Reaction, TweetReaction, Comment } from '../../models/models';
import { TweetService } from '../../services/tweet.service';
import { ReactionService } from '../../services/reaction.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    // Si las reacciones cambian desde el componente padre, recargar
    if (changes['reactions'] && !changes['reactions'].isFirstChange()) {
      this.loadReactions();
    }
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  hideMenu(): void {
    this.showMenu = false;
  }

  loadReactions(): void {
    if (!this.tweet?.id) return;

    console.log(`Loading reactions for tweet ${this.tweet.id}...`);

    this.reactionService.getReactionsByTweet(this.tweet.id).subscribe({
      next: (reactions) => {
        console.log(`Reactions for tweet ${this.tweet.id}:`, reactions);
        this.tweetReactions = reactions;
        this.calculateReactionCounts();
        this.findUserReaction();
      },
      error: (error) => {
        console.error('Error loading tweet reactions:', error);
        // Inicializar contadores vacíos en caso de error
        this.reactionCounts = {};
        this.tweetReactions = [];
        this.userReaction = null;
      }
    });
  }

  calculateReactionCounts(): void {
    this.reactionCounts = {};
    this.tweetReactions.forEach(tr => {
      const reactionId = tr.reaction.id;
      this.reactionCounts[reactionId] = (this.reactionCounts[reactionId] || 0) + 1;
    });
    console.log('Reaction counts:', this.reactionCounts);
  }

  findUserReaction(): void {
    if (this.currentUser) {
      this.userReaction = this.tweetReactions.find(tr =>
        tr.user.id === this.currentUser!.id
      ) || null;
      console.log('User reaction:', this.userReaction);
    }
  }

  loadComments(): void {
    if (!this.tweet?.id) return;

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
    if (!this.currentUser || !this.tweet?.id) {
      console.log('No current user or tweet id');
      return;
    }

    console.log('Toggling reaction:', reaction);

    if (this.userReaction && this.userReaction.reaction.id === reaction.id) {
      // Remove reaction
      console.log('Removing reaction...');
      this.reactionService.removeReaction(this.tweet.id).subscribe({
        next: () => {
          console.log('Reaction removed successfully');
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

      console.log('Creating/updating reaction with request:', request);

      this.reactionService.createOrUpdateReaction(request).subscribe({
        next: (response) => {
          console.log('Reaction created/updated successfully:', response);
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
    if (!this.newCommentContent.trim() || !this.currentUser || !this.tweet?.id) return;

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
    return this.currentUser?.id === this.tweet.postedBy?.id;
  }

  getUserInitials(user: User | null): string {
    if (!user || !user.username) return '??';
    return user.username.substring(0, 2).toUpperCase();
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const fullDate = date.toLocaleDateString('es-ES', options);

    let relativeTime = '';
    if (diffInSeconds < 60) {
      relativeTime = `hace ${diffInSeconds} segundos`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      relativeTime = `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      relativeTime = `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      relativeTime = `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      relativeTime = `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      relativeTime = `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      relativeTime = `hace ${years} ${years === 1 ? 'año' : 'años'}`;
    }

    return `${relativeTime} (${fullDate})`;
  }

  getTotalReactions(): number {
    return Object.values(this.reactionCounts).reduce((sum, count) => sum + count, 0);
  }

  // Método para verificar si las reacciones están disponibles
  hasReactions(): boolean {
    return this.reactions && this.reactions.length > 0;
  }

  // Método para verificar si una reacción específica está activa
  isReactionActive(reaction: Reaction): boolean {
    return this.userReaction?.reaction?.id === reaction.id;
  }

  // Método para obtener el conteo de una reacción específica
  getReactionCount(reaction: Reaction): number {
    return this.reactionCounts[reaction.id] || 0;
  }
}
