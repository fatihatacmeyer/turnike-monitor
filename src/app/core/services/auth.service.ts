// // import { Injectable, Inject } from '@angular/core';
// // import { HttpClient, HttpParams } from '@angular/common/http'; // HttpParams eklendi
// // import { BehaviorSubject, Observable } from 'rxjs';
// // import { map } from 'rxjs/operators';
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
    
// //     // API sunucusunun çökmemesi için parametreler HttpParams ile encode edilerek gönderilir
// //     const params = new HttpParams().set('Name', nameParam);

// //     return this.http.get<any>(apiUrl, { params }).pipe(
// //       map(response => {
// //         const user = Array.isArray(response) ? response[0] : response;
// //         if (user?.islemsonuc == "1") {
// //           this.setAuthToLocalStorage(user);
// //           this.helper.userLoginModel = user;
// //           this.currentUserSubject.next(user);
// //           return user;
// //         } else {
// //           throw new Error('Kullanıcı adı veya şifre hatalı');
// //         }
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
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { BehaviorSubject, Observable, throwError } from 'rxjs'; // throwError eklendi
// import { map, catchError } from 'rxjs/operators'; // catchError eklendi
// import { Router } from '@angular/router';
// import { HelperService } from './helper.service';
// import { APP_CONFIG, AppConfig } from './app-config.service';

// @Injectable({
//   providedIn: 'root'
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
//     @Inject(APP_CONFIG) private config: AppConfig
//   ) {
//     let storedUser = this.getAuthFromLocalStorage();
//     if (!storedUser && !this.config.isAuthEnabled) {
//       storedUser = {
//         id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
//         admin: false, bolum: 1, customerName: 'Bypass Kullanıcı', customerCode: 'BYPASS',
//         islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'bypass-token',
//         yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
//       };
//       this.setAuthToLocalStorage(storedUser);
//     }
//     this.currentUserSubject = new BehaviorSubject<any>(storedUser);
//     if (storedUser) {
//         this.helper.userLoginModel = storedUser;
//     }
//   }

//   login(email: string, password: string): Observable<any> {
//     const apiUrl = `${this.config.apiUrl}/Login`;
//     const nameParam = `LoginName=${email}&Password=${password}&ldap=0`;
    
//     const params = new HttpParams().set('Name', nameParam);

//     return this.http.get<any>(apiUrl, { params }).pipe(
//       map(response => {
//         const user = Array.isArray(response) ? response[0] : response;
        
//         // API islemsonuc değerini string veya number olarak dönebilir
//         if (user && (user.islemsonuc == "1" || user.islemsonuc == 1)) {
//           this.setAuthToLocalStorage(user);
//           this.helper.userLoginModel = user;
//           this.currentUserSubject.next(user);
//           return user;
//         } else {
//           // Hata durumunu açıkça fırlatıyoruz
//           throw new Error('Invalid credentials');
//         }
//       }),
//       catchError(error => {
//         // HTTP hatalarını ve map içindeki hataları yakalayıp component'e iletiyoruz
//         return throwError(() => error);
//       })
//     );
//   }

//   logout() {
//     const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
//     localStorage.removeItem(authLocalStorageToken);
//     this.currentUserSubject.next(null);
//     this.router.navigate(['/login']);
//   }

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
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { APP_CONFIG, AppConfig } from './app-config.service';

@Injectable({
  providedIn: 'root'
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
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    // let storedUser = this.getAuthFromLocalStorage(); // İleride açmak isterseniz yorumu kaldırın
    let storedUser = null; // Sayfa yenilendiğinde çıkış yapılması için bellekte null tutuluyor

    if (!storedUser && !this.config.isAuthEnabled) {
      storedUser = {
        id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
        admin: false, bolum: 1, customerName: 'Bypass Kullanıcı', customerCode: 'BYPASS',
        islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'bypass-token',
        yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
      };
      // this.setAuthToLocalStorage(storedUser); // İleride açmak isterseniz yorumu kaldırın
    }

    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    
    if (storedUser) {
        this.helper.userLoginModel = storedUser;
    }
  }

  login(email: string, password: string): Observable<any> {
    const apiUrl = `${this.config.apiUrl}/Login`;
    const nameParam = `LoginName=${email}&Password=${password}&ldap=0`;
    
    const params = new HttpParams().set('Name', nameParam);

    return this.http.get<any>(apiUrl, { params }).pipe(
      map(response => {
        const user = Array.isArray(response) ? response[0] : response;
        
        if (user && (user.islemsonuc == "1" || user.islemsonuc == 1)) {
          // this.setAuthToLocalStorage(user); // İleride açmak isterseniz yorumu kaldırın
          this.helper.userLoginModel = user;
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout() {
    // const authLocalStorageToken = `${this.config.appVersion}-${this.config.USERDATA_KEY}`;
    // localStorage.removeItem(authLocalStorageToken); // İleride açmak isterseniz yorumu kaldırın
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Fonksiyonlar ileride kullanılabilmesi için yorum satırına alınmadan bırakıldı
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