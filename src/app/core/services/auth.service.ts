// // // import { Injectable, Inject } from '@angular/core';
// // // import { HttpClient, HttpParams } from '@angular/common/http'; // HttpParams eklendi
// // // import { BehaviorSubject, Observable } from 'rxjs';
// // // import { map } from 'rxjs/operators';
// // // import { Router } from '@angular/router';
// // // import { HelperService } from './helper.service';
// // // import { APP_CONFIG, AppConfig } from './app-config.service';

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class AuthService {
// // //   private currentUserSubject: BehaviorSubject<any>;

// // //   get currentUserValue(): any {
// // //     return this.currentUserSubject.value;
// // //   }

// // //   constructor(
// // //     private http: HttpClient,
// // //     private router: Router,
// // //     private helper: HelperService,
// // //     @Inject(APP_CONFIG) private config: AppConfig
// // //   ) {
// // //     let storedUser = this.getAuthFromLocalStorage();
// // //     if (!storedUser && !this.config.isAuthEnabled) {
// // //       storedUser = {
// // //         id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
// // //         admin: false, bolum: 1, customerName: 'Bypass Kullanıcı', customerCode: 'BYPASS',
// // //         islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'bypass-token',
// // //         yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
// // //       };
// // //       this.setAuthToLocalStorage(storedUser);
// // //     }
// // //     this.currentUserSubject = new BehaviorSubject<any>(storedUser);
// // //     if (storedUser) {
// // //         this.helper.userLoginModel = storedUser;
// // //     }
// // //   }

// // //   login(email: string, password: string): Observable<any> {
// // //     const apiUrl = `${this.config.apiUrl}/Login`;
// // //     const nameParam = `LoginName=${email}&Password=${password}&ldap=0`;

// // //     // API sunucusunun çökmemesi için parametreler HttpParams ile encode edilerek gönderilir
// // //     const params = new HttpParams().set('Name', nameParam);

// // //     return this.http.get<any>(apiUrl, { params }).pipe(
// // //       map(response => {
// // //         const user = Array.isArray(response) ? response[0] : response;
// // //         if (user?.islemsonuc == "1") {
// // //           this.setAuthToLocalStorage(user);
// // //           this.helper.userLoginModel = user;
// // //           this.currentUserSubject.next(user);
// // //           return user;
// // //         } else {
// // //           throw new Error('Kullanıcı adı veya şifre hatalı');
// // //         }
// // //       })
// // //     );
// // //   }

// // //   logout() {
// // //     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// // //     localStorage.removeItem(authLocalStorageToken);
// // //     this.currentUserSubject.next(null);
// // //     this.router.navigate(['/login']);
// // //   }

// // //   private setAuthToLocalStorage(auth: any) {
// // //     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// // //     localStorage.setItem(authLocalStorageToken, JSON.stringify(auth));
// // //   }

// // //   private getAuthFromLocalStorage(): any {
// // //     try {
// // //       const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// // //       const lsValue = localStorage.getItem(authLocalStorageToken);
// // //       if (!lsValue) return null;
// // //       return JSON.parse(lsValue);
// // //     } catch (error) {
// // //       return null;
// // //     }
// // //   }
// // // }

// // import { Injectable, Inject } from '@angular/core';
// // import { HttpClient, HttpParams } from '@angular/common/http';
// // import { BehaviorSubject, Observable, throwError } from 'rxjs'; // throwError eklendi
// // import { map, catchError } from 'rxjs/operators'; // catchError eklendi
// // import { Router } from '@angular/router';
// // import { HelperService } from './helper.service';
// // import { APP_CONFIG, AppConfig } from './app-config.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {
// //   private currentUserSubject: BehaviorSubject<any>;

// //   get currentUserValue(): any {
// //     return this.currentUserSubject.value;
// //   }

// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     private helper: HelperService,
// //     @Inject(APP_CONFIG) private config: AppConfig
// //   ) {
// //     let storedUser = this.getAuthFromLocalStorage();
// //     if (!storedUser && !this.config.isAuthEnabled) {
// //       storedUser = {
// //         id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
// //         admin: false, bolum: 1, customerName: 'Bypass Kullanıcı', customerCode: 'BYPASS',
// //         islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'bypass-token',
// //         yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
// //       };
// //       this.setAuthToLocalStorage(storedUser);
// //     }
// //     this.currentUserSubject = new BehaviorSubject<any>(storedUser);
// //     if (storedUser) {
// //         this.helper.userLoginModel = storedUser;
// //     }
// //   }

// //   login(email: string, password: string): Observable<any> {
// //     const apiUrl = `${this.config.apiUrl}/Login`;
// //     const nameParam = `LoginName=${email}&Password=${password}&ldap=0`;

// //     const params = new HttpParams().set('Name', nameParam);

// //     return this.http.get<any>(apiUrl, { params }).pipe(
// //       map(response => {
// //         const user = Array.isArray(response) ? response[0] : response;

// //         // API islemsonuc değerini string veya number olarak dönebilir
// //         if (user && (user.islemsonuc == "1" || user.islemsonuc == 1)) {
// //           this.setAuthToLocalStorage(user);
// //           this.helper.userLoginModel = user;
// //           this.currentUserSubject.next(user);
// //           return user;
// //         } else {
// //           // Hata durumunu açıkça fırlatıyoruz
// //           throw new Error('Invalid credentials');
// //         }
// //       }),
// //       catchError(error => {
// //         // HTTP hatalarını ve map içindeki hataları yakalayıp component'e iletiyoruz
// //         return throwError(() => error);
// //       })
// //     );
// //   }

// //   logout() {
// //     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// //     localStorage.removeItem(authLocalStorageToken);
// //     this.currentUserSubject.next(null);
// //     this.router.navigate(['/login']);
// //   }

// //   private setAuthToLocalStorage(auth: any) {
// //     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// //     localStorage.setItem(authLocalStorageToken, JSON.stringify(auth));
// //   }

// //   private getAuthFromLocalStorage(): any {
// //     try {
// //       const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
// //       const lsValue = localStorage.getItem(authLocalStorageToken);
// //       if (!lsValue) return null;
// //       return JSON.parse(lsValue);
// //     } catch (error) {
// //       return null;
// //     }
// //   }
// // }

// import { Injectable, Inject } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { HelperService } from './helper.service';
// import { APP_CONFIG, AppConfig } from './app-config.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUserSubject: BehaviorSubject<any>;

//   get currentUserValue(): any {
//     return this.currentUserSubject.value;
//   }

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private helper: HelperService,
//     @Inject(APP_CONFIG) private config: AppConfig,
//   ) {
//     // let storedUser = this.getAuthFromLocalStorage(); // İleride açmak isterseniz yorumu kaldırın
//     let storedUser = null; // Sayfa yenilendiğinde çıkış yapılması için bellekte null tutuluyor

//     if (!storedUser && !this.config.isAuthEnabled) {
//       storedUser = {
//         id: 1,
//         loginname: 'ekran',
//         extloginname: '',
//         access: 'full',
//         accessmenu: true,
//         admin: false,
//         bolum: 1,
//         customerName: 'Bypass Kullanıcı',
//         customerCode: 'BYPASS',
//         islemno: '1',
//         kademe: 1,
//         xsicilid: 1,
//         tokenid: 'bypass-token',
//         yetki: 1,
//         gorev: 1,
//         terminalgrubu: 0,
//         terminalgroup: 0,
//         islemsonuc: 1,
//       };
//       // this.setAuthToLocalStorage(storedUser); // İleride açmak isterseniz yorumu kaldırın
//     }

//     this.currentUserSubject = new BehaviorSubject<any>(storedUser);

//     if (storedUser) {
//       this.helper.userLoginModel = storedUser;
//     }
//   }

//   // login(email: string, password: string): Observable<any> {
//   //   // TrendyolTurnike projesindeki orijinal login endpoint
//   //   const apiUrl = `${this.config.apiUrl}/MonitorLogin`;
//   //   const nameParam = `LoginName=${email}&Password=${password}&ldap=0`;

//   //   const params = new HttpParams().set('Name', nameParam);

//   //   return this.http.get<any>(apiUrl, { params }).pipe(
//   //     map(response => {
//   //       const user = Array.isArray(response) ? response[0] : response;

//   //       if (user && (user.islemsonuc == "1" || user.islemsonuc == 1)) {
//   //         // this.setAuthToLocalStorage(user); // İleride açmak isterseniz yorumu kaldırın
//   //         this.helper.userLoginModel = user;
//   //         this.currentUserSubject.next(user);
//   //         return user;
//   //       } else {
//   //         throw new Error('Invalid credentials');
//   //       }
//   //     }),
//   //     catchError(error => {
//   //       return throwError(() => error);
//   //     })
//   //   );
//   // }

//   login(email: string, password: string): Observable<any> {
//     const apiUrl = `${this.config.apiUrl}/Login`;

//     // Parametreleri eski test kodundaki gibi Name parametresi altında birleştiriyoruz
//     const nameParam = `LoginName=${email}&Password=${password}`;
//     const params = new HttpParams().set('Name', nameParam);

//     // DİKKAT: post değil, get kullanıyoruz
//     return this.http.get<any>(apiUrl, { params }).pipe(
//       map((response) => {
//         // Gelen yanıt dizi ise ilk elemanını, değilse kendisini al
//         const user = Array.isArray(response) ? response[0] : response;

//         if (user && (user.islemsonuc == '1' || user.islemsonuc == 1)) {
//           this.helper.userLoginModel = user;
//           this.currentUserSubject.next(user);
//           return user;
//         } else {
//           throw new Error('Kullanıcı adı veya şifre hatalı');
//         }
//       }),
//       catchError((error) => {
//         // Hata durumunu console'a yazdırarak daha rahat yakalayabilirsin
//         console.error('Giriş Hatası:', error);
//         return throwError(() => error);
//       }),
//     );
//   }

//   logout() {
//     // const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
//     // localStorage.removeItem(authLocalStorageToken); // İleride açmak isterseniz yorumu kaldırın

//     this.currentUserSubject.next(null);
//     this.router.navigate(['/login']);
//   }

//   // Fonksiyonlar ileride kullanılabilmesi için yorum satırına alınmadan bırakıldı
//   private setAuthToLocalStorage(auth: any) {
//     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
//     localStorage.setItem(authLocalStorageToken, JSON.stringify(auth));
//   }

//   private getAuthFromLocalStorage(): any {
//     try {
//       const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
//       const lsValue = localStorage.getItem(authLocalStorageToken);
//       if (!lsValue) return null;
//       return JSON.parse(lsValue);
//     } catch (error) {
//       return null;
//     }
//   }
// }

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
    let storedUser = null;

    if (!storedUser && !this.config.isAuthEnabled) {
      storedUser = {
        id: 1,
        loginname: 'ekran',
        extloginname: '',
        access: 'full',
        accessmenu: true,
        admin: false,
        bolum: 1,
        customerName: 'Bypass Kullanıcı',
        customerCode: 'BYPASS',
        islemno: '1',
        kademe: 1,
        xsicilid: 1,
        tokenid: 'bypass-token',
        yetki: 1,
        gorev: 1,
        terminalgrubu: 0,
        terminalgroup: 0,
        islemsonuc: 1,
      };
    }

    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    if (storedUser) {
      this.helper.userLoginModel = storedUser;
    }
  }

  login(email: string, password: string, securityCode: string = ''): Observable<any> {
    // API endpoint'in POST için ayarlandı (küçük/büyük harf sunucuda nasılsa öyle bırak)
    const apiUrl = `${this.config.apiUrl}/Login`;

    // 1. Parametreleri orijinal sistemdeki gibi birleştiriyoruz
    const loginParamString = `LoginName=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}&ldap=0&SecurityCode=${securityCode}`;

    // 2. Dinamik Tarih Bazlı Anahtar (Key) Üretimi
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const monthStr = (mm > 9 ? '' : '0') + mm;
    const dayStr = (dd > 9 ? '' : '0') + dd;
    const yearStr = today.getFullYear().toString();

    // Eski koddaki anahtar birleştirme formatı: YYYYMMDDMMYYYYDD
    const keyStr = `${yearStr}${monthStr}${dayStr}${monthStr}${yearStr}${dayStr}`;

    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);

    // 3. AES-CBC Şifreleme İşlemi
    const encryptedParam = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(loginParamString), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 4. Sunucuya gidecek nihai JSON payload
    const payload = { param: encryptedParam.toString() };

    // 5. POST isteği atıyoruz
    return this.http.post<any>(apiUrl, payload).pipe(
      map((response) => {
        const user = Array.isArray(response) ? response[0] : response;

        if (user && (user.islemsonuc == '1' || user.islemsonuc == 1)) {
          this.helper.userLoginModel = user;
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Kullanıcı adı veya şifre hatalı');
        }
      }),
      catchError((error) => {
        console.error('Giriş Hatası:', error);
        return throwError(() => error);
      }),
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
