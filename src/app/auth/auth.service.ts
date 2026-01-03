import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<any | null>(null);

  user = this._user.asReadonly();

  login(email: string, password: string) {
    this._user.set({ email });
  }

  signup(email: string, password: string) {
    this._user.set({ email });
  }

  logout() {
    this._user.set(null);
  }

  isLoggedIn(): boolean {
    return !!this._user();
  }
}
