// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'explore', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'notifications', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'messages', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'bookmarks', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'playlists', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'concerts', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'artists', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'genres', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: 'settings', component: HomeComponent, canActivate: [AuthGuard] }, // Temporal
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
