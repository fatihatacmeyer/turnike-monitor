import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { APP_CONFIG, AppConfig } from './app-config.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private helper: HelperService,
    @Inject(APP_CONFIG) private config: AppConfig,
  ) {
    let storedUser = this.getAuthFromLocalStorage();
    if (!storedUser && !this.config.isAuthEnabled) {
      storedUser = {
        id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
        admin: false, bolum: 1, customerName: 'Bypass Kullanıcı', customerCode: 'BYPASS',
        islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'bypass-token',
        yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
      };
      this.setAuthToLocalStorage(storedUser);
    }
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    if (storedUser) {
      this.helper.userLoginModel = storedUser;
    }
  }

  login(email: string, password: string, securityCode: string = ''): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Login`;

    // 1. Parametreleri birleştir
    const loginParamString = `LoginName=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}&ldap=0&SecurityCode=${securityCode}`;

    // 2. Dinamik Tarih Bazlı Anahtar (Key) Üretimi
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    const monthStr = (mm > 9 ? '' : '0') + mm;
    const dayStr = (dd > 9 ? '' : '0') + dd;
    const yearStr = today.getFullYear().toString();
    const keyStr = `${yearStr}${monthStr}${dayStr}${monthStr}${yearStr}${dayStr}`;

    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);

    // 3. AES-CBC Şifreleme
    const encryptedParam = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(loginParamString),
      key,
      { keySize: 128 / 8, iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );

    // 4. API'ye gönderilecek payload
    const payload = { param: encryptedParam.toString() };

    return this.http.post<any>(apiUrl, payload).pipe(
      map((response) => {
        const user = Array.isArray(response) ? response[0] : response;
        if (user && (user.islemsonuc == '1' || user.islemsonuc == 1)) {
          this.setAuthToLocalStorage(user);
          this.helper.userLoginModel = user;
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Kullanıcı adı veya şifre hatalı');
        }
      }),
      catchError((error) => {
        console.error('Giriş Hatası:', error);
        throw error;
      }),
    );
  }

  logout() {
    const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
    localStorage.removeItem(authLocalStorageToken);
    this.currentUserSubject.next(null);
    this.helper.userLoginModel = {
      customerCode: '', fullname: '', username: '', loginname: '',
      gorev: null, yetki: null, bolum: null, kademe: null, xsicilid: null,
      extloginname: '', customerName: '', id: null, tokenid: '',
      islemno: '', access: '', accessmenu: true, admin: false
    };
    this.router.navigate(['/login']);
  }

  private setAuthToLocalStorage(auth: any) {
    const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
    localStorage.setItem(authLocalStorageToken, JSON.stringify(auth));
  }

  private getAuthFromLocalStorage(): any {
    try {
      const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
      const lsValue = localStorage.getItem(authLocalStorageToken);
      if (!lsValue) return null;
      return JSON.parse(lsValue);
    } catch (error) {
      return null;
    }
  }
}
