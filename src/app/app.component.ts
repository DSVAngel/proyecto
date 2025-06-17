// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'music-twitter-frontend';
  showNavbar = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Show navbar on protected routes
        this.showNavbar = this.authService.isLoggedIn() &&
                         !this.isAuthRoute(event.url);
      }
    });
  }

  private isAuthRoute(url: string): boolean {
    return url.includes('/login') || url.includes('/register');
  }
}
