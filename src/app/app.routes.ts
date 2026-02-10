import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';
import { BOARD_ROUTES } from './board/board.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path:'dashboard',
    children:DASHBOARD_ROUTES
  },
  {
    path: 'board',
    children:BOARD_ROUTES
  }
];
