import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/MonitorLogin`;

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const params = { Name: `LoginName=${email}&Password=${password}&ldap=0` };
    return this.http.get<any>(API_URL, { params });
  }

  getUserByToken(token: string): Observable<any> {
    return of(true);
  }
}
