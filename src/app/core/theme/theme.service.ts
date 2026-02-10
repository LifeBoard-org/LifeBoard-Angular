import { Injectable, signal } from '@angular/core';
import { ThemeMode } from './theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'lifeboard-theme';

  theme = signal<ThemeMode>(this.loadTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode) {
    this.theme.set(mode);
    this.applyTheme(mode);
    localStorage.setItem(this.STORAGE_KEY, mode);
  }

  private applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
  }

  private loadTheme(): ThemeMode {
    return (localStorage.getItem(this.STORAGE_KEY) as ThemeMode) || 'light';
  }
  isDarkMode(): boolean {
    return this.theme() === 'dark';
  }
}
