// src/app/components/trending-sidebar/trending-sidebar.component.ts

import { Component, OnInit } from '@angular/core';

interface TrendingTopic {
  category: string;
  title: string;
  tweets: number;
}

interface MusicRecommendation {
  artist: string;
  song: string;
  genre: string;
  icon: string;
}

@Component({
  selector: 'app-trending-sidebar',
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent implements OnInit {

  trendingTopics: TrendingTopic[] = [
    { category: 'Música trending', title: '#TaylorSwift', tweets: 45200 },
    { category: 'Conciertos', title: '#ColdplayTour2024', tweets: 23100 },
    { category: 'Álbumes', title: '#NewRelease', tweets: 18500 },
    { category: 'Festivales', title: '#Coachella2024', tweets: 12300 },
    { category: 'Artistas', title: '#BadBunny', tweets: 8900 }
  ];

  musicRecommendations: MusicRecommendation[] = [
    { artist: 'Billie Eilish', song: 'What Was I Made For?', genre: 'Pop', icon: 'fas fa-play-circle' },
    { artist: 'The Weeknd', song: 'Blinding Lights', genre: 'R&B', icon: 'fas fa-music' },
    { artist: 'Dua Lipa', song: 'Dance The Night', genre: 'Dance', icon: 'fas fa-headphones' },
    { artist: 'Harry Styles', song: 'As It Was', genre: 'Pop Rock', icon: 'fas fa-guitar' }
  ];

  musicStats = {
    activeUsers: '2.3M',
    songsShared: '847K',
    concertsToday: '127',
    newArtists: '89'
  };

  constructor() { }

  ngOnInit(): void {
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

