import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from './app-config.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class TurnikeService {

  constructor(
    private http: HttpClient,
    private helper: HelperService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  getTurnike(token: string, terminalId: number): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;

    
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`;
    const params = new HttpParams().set('Name', nameParam);
    const headers = new HttpHeaders().set('Accept', 'application/json');
    
    return this.http.get<any>(apiUrl, { headers, params });
  }

  getTerminal(token: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=tl`;
    const params = new HttpParams().set('Name', nameParam);
    const headers = new HttpHeaders().set('Accept', 'application/json');
    
    return this.http.get<any>(apiUrl, { headers, params }).pipe(
      map((response: any[]) => {
        const data = Array.isArray(response) ? response : [];
        return data.map(item => ({
          Id: item.TerminalID ?? item.Id,
          Ad: item.TerminalAdi ?? item.Ad,
          ...item
        }));
      })
    );
  }
}