import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../Interfaces/role';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getRoles(): Observable<Role[]> {
    const url = `${this.apiServerUrl}/api/roles/getRoles`;
    const headers = this.getHeaders();
    return this.http.get<Role[]>(url, { headers });
  }
  assignRoleToUser(roleId: number, userId: number): Observable<any> {
    const url = `${this.apiServerUrl}/api/roles/assign/${roleId}`;
    const headers = this.getHeaders();
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.post(url, {}, { headers, params });
  }
  hasRole(roleName:string,user:User):Role {
    return user.roles.some((role: { name: string; }) => role.name === roleName);
  }
  // assignRoleToUser(roleId: number, userId: number): Observable<any> {
  //   const url = `${this.baseUrl}/assign/${roleId}?userId=${userId}`;
  //   const headers = this.getHeaders();

  //   return this.http.post(url, null, { headers });
  // }
}
