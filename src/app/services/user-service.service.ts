import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';
import { User } from '../Interfaces/user';
import { Role } from '../Interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private fakeApiServerUrl = 'assets/fake-users.json'; //fake
  private apiServerUrl = 'http://localhost:8080';
  private guestUser: User = {
    id: 0,
    name: 'Guest',
    email: 'Guest@example.com.',
    password: '1234',
  };

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('userDataShop');
    console.log('Stored user:', storedUser); // Debugging line
    if (
      storedUser == 'undefined' ||
      storedUser === null ||
      storedUser === undefined
    ) {
      this.user = this.guestUser;
      localStorage.setItem('userDataShop', JSON.stringify(this.user));
    }
    // if (storedUser) {
    //   this.user = JSON.parse(storedUser);
    // }
    if (storedUser !== null && storedUser !== 'undefined') {
      this.user = JSON.parse(storedUser);
    }
  }

  private user: User | undefined;

  setUser(user: User | undefined) {
    this.user = user;
    localStorage.setItem('userDataShop', JSON.stringify(user));
  }

  getUser(): User | undefined {
    if (this.user && this.user.id == 0) return undefined;
    return this.user;
  }
  getGuest(): User {
    return this.guestUser;
  }
  getUserRoles(): Role[] | undefined {
    if (this.user && this.user.roles) return this.user.roles;
    return undefined;
  }
  isLoggedIn(): boolean {
    const userData = localStorage.getItem('userDataShop');
    if (this.user)
      return userData !== null && userData !== undefined && this.user.id != 0;
    return false;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  findUserByName(name: string): Observable<User> {
    const url = `${this.apiServerUrl}/registration/${name}`; // Replace with actual API endpoint
    return this.http.get<User>(url, { headers: this.getHeaders() });
  }
  public getUsers(): Observable<User[]> {
    const observable = this.http.get<User[]>(
      `${this.apiServerUrl}/registration/all`,
      { headers: this.getHeaders() }
    );
    observable.subscribe(
      (users) => {
        console.log('Received users:', users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
    return observable;
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/registration/add`, user, {
      headers: this.getHeaders(),
    });
  }

  addUsers(users: TreeNode[]): Observable<User[]> {
    return this.http.post<User[]>(
      `${this.apiServerUrl}/registration/add-many`,
      users,
      { headers: this.getHeaders() }
    );
  }

  addBulkUsers(users: TreeNode[]): Observable<User[]> {
    return this.http.post<User[]>(
      `${this.apiServerUrl}/registration/create-bulk`,
      users,
      { headers: this.getHeaders() }
    );
  }

  public editUser(User: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiServerUrl}/registration/update`,
      User,
      { headers: this.getHeaders() }
    );
  }
  updateUserName(userId: number, newName: string): Observable<User> {
    const url = `${this.apiServerUrl}/registration/${userId}/name`;
    const body = newName;
    return this.http.put<User>(url, body, { headers: this.getHeaders() });
  }
  updateUserEmail(userId: number, newEmail: string): Observable<User> {
    const url = `${this.apiServerUrl}/registration/${userId}/email`;
    const body = newEmail;
    return this.http.put<User>(url, body, { headers: this.getHeaders() });
  }

  public deleteUser(UserId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/registration/delete/${UserId}`,
      { headers: this.getHeaders() }
    );
  }

  getUsersJson(): Observable<User[]> {
    return this.http
    .get<User[]>(this.fakeApiServerUrl, { headers: this.getHeaders() })
    .pipe(
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return of([]); // Return an empty array if there's an error
      })
    );
  }
}
