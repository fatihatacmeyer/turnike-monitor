import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  login(email: string, password: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/MonitorLogin`;
    const params = { Name: `LoginName=${email}&Password=${password}&ldap=0` };
    return this.http.get<any>(apiUrl, { params });
  }

  getUserByToken(token: string): Observable<any> {
    return of(true);
  }
}
