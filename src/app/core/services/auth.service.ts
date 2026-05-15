import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthHttpService } from './auth-http.service';
import { HelperService } from './helper.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private currentUserSubject: BehaviorSubject<any>;

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor(
    private authHttpService: AuthHttpService,
    private router: Router,
    private helper: HelperService
  ) {
    const storedUser = this.getAuthFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    if (storedUser) {
        this.helper.userLoginModel = storedUser;
    }
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.authHttpService.login(email, password).subscribe({
        next: (auth: any) => {
          const user = auth[0];
          if (user) {
            this.setAuthToLocalStorage(user);
            this.helper.userLoginModel = user;
            this.currentUserSubject.next(user);
            observer.next(this.currentUserSubject);
          } else {
            observer.error('Login failed');
          }
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
          observer.complete();
        }
      });
    });
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setAuthToLocalStorage(auth: any) {
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
  }

  private getAuthFromLocalStorage(): any {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) return null;
      return JSON.parse(lsValue);
    } catch (error) {
      return null;
    }
  }
}
