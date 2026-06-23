// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Injectable, Inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { APP_CONFIG, AppConfig } from './app-config.service';
// import { HelperService } from './helper.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class TurnikeService {
//   constructor(
//     private http: HttpClient,
//     private helper: HelperService,
//     @Inject(APP_CONFIG) private config: AppConfig,
//   ) {}

//   // getTurnike(token: string, terminalId: number): Observable<any> {
//   //   const apiUrl = `${this.config.apiUrl}/Dynamic`;

//   //   const nameParam = `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`;
//   //   const params = new HttpParams().set('Name', nameParam);
//   //   const headers = new HttpHeaders().set('Accept', 'application/json');

//   //   return this.http.get<any>(apiUrl, { headers, params });
//   // }

//   // getTerminal(token: string): Observable<any> {
//   //   const apiUrl = `${this.config.apiUrl}/Dynamic`;
//   //   const nameParam = `tokenid=${token}&point=lastpass&islemtipi=tl`;
//   //   const params = new HttpParams().set('Name', nameParam);
//   //   const headers = new HttpHeaders().set('Accept', 'application/json');

//   //   return this.http.get<any>(apiUrl, { headers, params }).pipe(
//   //     map((response: any[]) => {
//   //       const data = Array.isArray(response) ? response : [];
//   //       return data.map(item => ({
//   //         Id: item.TerminalID ?? item.Id,
//   //         Ad: item.TerminalAdi ?? item.Ad,
//   //         ...item
//   //       }));
//   //     })
//   //   );
//   // }

//   getTurnike(token: string, terminalId: number): Observable<any> {
//     const apiUrl = `${this.config.apiUrl}/Dynamic`;

//     const userId = this.helper.userLoginModel.xsicilid || this.helper.userLoginModel.id || '';

//     // Eski lastpass uygulamasındaki raw string formatı birebir aynı
//     // const nameParam = `islemtipi=p&tokenid=${token}&tarihbas=&tarihbit=&sicilno=&bolum#cbo_bolum=&point=lastpass&terminalid=${terminalId}`;
//     const nameParam = `islemtipi=p&tokenid=${token}&tarihbas=&tarihbit=&sicilno=${userId}&bolum#cbo_bolum=&point=lastpass&terminalid=${terminalId}`;
//     // HttpParams kullanarak Angular'ın stringi URL-Encode yapmasını (eski sistem gibi) sağlıyoruz
//     const params = new HttpParams().set('Name', nameParam);
//     const headers = new HttpHeaders().set('Accept', 'application/json');

//     return this.http.get<any>(apiUrl, { headers, params });
//   }

//   getTerminal(token: string): Observable<any> {
//     const apiUrl = `${this.config.apiUrl}/Dynamic`;
//     const userId = this.helper.userLoginModel.xsicilid || this.helper.userLoginModel.id || '';
//     const nameParam = `islemtipi=t&tokenid=${token}&tarihbas=&tarihbit=&sicilno=&bolum#cbo_bolum=&point=lastpass`;
//     // const nameParam = `islemtipi=t&tokenid=${token}&tarihbas=&tarihbit=&sicilno=${userId}&bolum#cbo_bolum=&point=lastpass`;
//     const params = new HttpParams().set('Name', nameParam);
//     const headers = new HttpHeaders().set('Accept', 'application/json');

//     return this.http.get<any>(apiUrl, { headers, params }).pipe(
//       map((response: any[]) => {
//         const data = Array.isArray(response) ? response : [];
//         return data.map((item) => ({
//           Id: item.TerminalID ?? item.Id,
//           Ad: item.TerminalAdi ?? item.Ad,
//           ...item,
//         }));
//       }),
//     );
//   }
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
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

    // Eski koddaki orijinal yapı: islemtipi=pp ve terminalgrubu
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`;
    const params = new HttpParams().set('Name', nameParam);

    return this.http.get<any>(apiUrl, { params }).pipe(
      tap((response) => {
        console.log(">>> [getTurnike] API'den Gelen Veri:", response);
      }),
      catchError((error) => {
        console.error('>>> [getTurnike] HATA:', error);
        return throwError(() => error);
      }),
    );
  }

  getTerminal(token: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Dynamic`;

    // Eski koddaki orijinal yapı: islemtipi=tl
    const nameParam = `tokenid=${token}&point=lastpass&islemtipi=tl`;
    const params = new HttpParams().set('Name', nameParam);

    return this.http.get<any>(apiUrl, { params }).pipe(
      tap((response) => {
        console.log(">>> [getTerminal] API'den Gelen Ham Veri:", response);
      }),
      map((response: any[]) => {
        const data = Array.isArray(response) ? response : [];
        const mappedData = data.map((item) => ({
          Id: item.TerminalID ?? item.Id,
          Ad: item.TerminalAdi ?? item.Ad,
          ...item,
        }));

        console.log('>>> [getTerminal] Map İşlemi Sonrası Veri:', mappedData);
        return mappedData;
      }),
      catchError((error) => {
        console.error('>>> [getTerminal] HATA:', error);
        return throwError(() => error);
      }),
    );
  }
}
