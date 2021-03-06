import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = '1';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }
  constructor() { }

  login(): void {
    this._userIsAuthenticated = true;
  }

  logout(): void {
    this._userIsAuthenticated = false;
  }
}
