import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TurnikeService {

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  getTurnike(token: string, terminalId: number): Observable<any> {
    const apiDynamic = `${this.config.apiUrl}/Dynamic`;
    const params = {
      Name: `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`
    };
    return this.http.get<any>(apiDynamic, { params });
  }

  getTerminal(token: string): Observable<any> {
    const apiDynamic = `${this.config.apiUrl}/Dynamic`;
    const params = {
      Name: `tokenid=${token}&point=lastpass&islemtipi=tl`
    };
    return this.http.get<any>(apiDynamic, { params });
  }
}
