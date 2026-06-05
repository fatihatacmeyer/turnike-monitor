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

    const userId = this.helper.userLoginModel.xsicilid || this.helper.userLoginModel.id || '';
    
    
    // Eski lastpass uygulamasındaki raw string formatı birebir aynı
    // const nameParam = `islemtipi=p&tokenid=${token}&tarihbas=&tarihbit=&sicilno=&bolum#cbo_bolum=&point=lastpass&terminalid=${terminalId}`;
    const nameParam = `islemtipi=p&tokenid=${token}&tarihbas=&tarihbit=&sicilno=${userId}&bolum#cbo_bolum=&point=lastpass&terminalid=${terminalId}`;
    // HttpParams kullanarak Angular'ın stringi URL-Encode yapmasını (eski sistem gibi) sağlıyoruz
    const params = new HttpParams().set('Name', nameParam);
    const headers = new HttpHeaders().set('Accept', 'application/json');
    
    return this.http.get<any>(apiUrl, { headers, params });
  }

  getTerminal(token: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;
    const userId = this.helper.userLoginModel.xsicilid || this.helper.userLoginModel.id || '';
    // const nameParam = `islemtipi=t&tokenid=${token}&tarihbas=&tarihbit=&sicilno=&bolum#cbo_bolum=&point=lastpass`;
    const nameParam = `islemtipi=t&tokenid=${token}&tarihbas=&tarihbit=&sicilno=${userId}&bolum#cbo_bolum=&point=lastpass`;
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