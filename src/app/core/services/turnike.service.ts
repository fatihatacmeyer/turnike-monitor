import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_DYNAMIC = `${environment.apiUrl}/Dynamic`;

@Injectable({
  providedIn: 'root'
})
export class TurnikeService {

  constructor(private http: HttpClient) {}

  getTurnike(token: string, terminalId: number): Observable<any> {
    const params = {
      Name: `tokenid=${token}&point=lastpass&islemtipi=pp&terminalgrubu=${terminalId}`
    };
    return this.http.get<any>(API_DYNAMIC, { params });
  }

  getTerminal(token: string): Observable<any> {
    const params = {
      Name: `tokenid=${token}&point=lastpass&islemtipi=tl`
    };
    return this.http.get<any>(API_DYNAMIC, { params });
  }
}
