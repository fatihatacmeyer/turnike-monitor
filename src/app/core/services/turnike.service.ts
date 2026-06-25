import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from './app-config.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class TurnikeService {
  constructor(
    private http: HttpClient,
    private helper: HelperService,
    @Inject(APP_CONFIG) private config: AppConfig,
  ) {}

  getTurnike(token: string, terminalId: number): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`;
    const params = new HttpParams().set('Name', nameParam);

    return this.http.get<any>(apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('getTurnike Hatası:', error);
        return throwError(() => error);
      }),
    );
  }

  getTerminal(token: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=tl`;
    const params = new HttpParams().set('Name', nameParam);

    return this.http.get<any>(apiUrl, { params }).pipe(
      map((response: any[]) => {
        const data = Array.isArray(response) ? response : [];
        return data.map((item) => ({
          Id: item.TerminalID ?? item.Id,
          Ad: item.TerminalAdi ?? item.Ad,
          ...item,
        }));
      }),
      catchError((error) => {
        console.error('getTerminal Hatası:', error);
        return throwError(() => error);
      }),
    );
  }
}
