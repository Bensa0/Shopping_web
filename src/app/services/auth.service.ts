import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  loggedInUser: string | null = null;
  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserServiceService
  ) {}
  // Call this method after successful sign-in
  signInSuccessful() {
    this.isAuthenticated = true;
  }

  // Call this method after sign-out
  signOut() {
    this.isAuthenticated = false;
  }

  // Check if the user is authenticated
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  setLoggedInUser(username: string | null) {
    this.loggedInUser = username;
  }
  getLoggedInUser() {
    return this.loggedInUser
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/auth/signin`, body);
  }
  logout(): Observable<any> {
    console.log('Token before logout:', localStorage.getItem('token'));
    this.setLoggedInUser(null);
    localStorage.removeItem('token'); // Clear the token
    localStorage.removeItem('userDataShop'); // Clear the token
    this.userService.setUser(undefined);
    this.signOut();
    console.log('Token after logout:', localStorage.getItem('token'));
    console.log('user after logout:', localStorage.getItem('userDataShop'));
    console.log('user is signout?:',this.isAuthenticated, this.signOut());
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }
}
