import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./anime/anime.component').then(m => m.AnimeComponent)
  }
];
