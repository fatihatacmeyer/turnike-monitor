import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../services/app-config.service';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  private mockAuth = {
    id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
    admin: false, bolum: 1, customerName: 'Demo Müşteri', customerCode: 'DEMO',
    islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'mock-token-2026',
    yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
  };

  private mockTerminals = [
    { Id: 1, Ad: 'Terminal-1 (Giriş)' },
    { Id: 2, Ad: 'Terminal-2 (Çıkış)' },
    { Id: 3, Ad: 'Terminal-3 (Personel)' },
    { Id: 4, Ad: 'Terminal-4 (Ziyaretçi)' },
    { Id: 5, Ad: 'Terminal-5 (Muhasebe)' },
    { Id: 6, Ad: 'Terminal-6 (İK)' }
  ];

  private staffList = [
    { fullName: 'Ahmet Yılmaz', department: 'IT', position: 'Yazılım Geliştirici' },
    { fullName: 'Ayşe Demir', department: 'İK', position: 'İnsan Kaynakları Uzmanı' },
    { fullName: 'Mehmet Kaya', department: 'Muhasebe', position: 'Muhasebe Müdürü' },
    { fullName: 'Fatma Şahin', department: 'Satış', position: 'Satış Temsilcisi' },
    { fullName: 'Ali Öztürk', department: 'Lojistik', position: 'Depo Sorumlusu' },
    { fullName: 'Zeynep Çelik', department: 'Pazarlama', position: 'Pazarlama Uzmanı' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.config.isMockEnabled) {
      return next.handle(req);
    }

    // URL karakterlerinin bozulma ihtimaline karşı decode işlemi
    const requestUrl = decodeURIComponent(req.urlWithParams).toLowerCase();

    if (requestUrl.includes('/login') || requestUrl.includes('monitorlogin')) {
      console.log('[Mock] Login:', requestUrl);
      return of(new HttpResponse({
        status: 200,
        body: [this.mockAuth]
      })).pipe(delay(200));
    }

    if (requestUrl.includes('dynamic')) {
      console.log('[Mock] Dynamic:', requestUrl);

      if (requestUrl.includes('islemtipi=t')) {
        console.log('[Mock] Returning terminals:', this.mockTerminals);
        return of(new HttpResponse({
          status: 200,
          body: this.mockTerminals
        })).pipe(delay(200));
      }

      if (requestUrl.includes('islemtipi=p')) {
        const mockData = this.generateTurnikeData();
        console.log('[Mock] Returning turnike data:', mockData);
        // Gerçek ağ gecikmesini simüle etmek ve Angular'ın veriyi ekrana basmasını sağlamak için delay(200) eklendi
        return of(new HttpResponse({
          status: 200,
          body: mockData
        })).pipe(delay(200));
      }

      console.log('[Mock] Unknown Dynamic request, returning empty:', requestUrl);
      return of(new HttpResponse({
        status: 200,
        body: []
      })).pipe(delay(200));
    }

    console.log('[Mock] Unmatched request, returning empty:', requestUrl);
    return of(new HttpResponse({
      status: 200,
      body: []
    })).pipe(delay(200));
  }

  private generateTurnikeData(): any[] {
    const currentDate = new Date();
    const todayString = currentDate.toISOString().split('T')[0];
    
    return this.staffList.map((person, index) => {
      const offsetMilliseconds = (60 - index * 10) * 60 * 1000 + Math.floor(Math.random() * 120 * 1000);
      const timestamp = new Date(currentDate.getTime() - offsetMilliseconds);
      const timeString = timestamp.toTimeString().split(' ')[0];
      
      return {
        Mesaj: 'OK',
        SicilNo: `${1001 + index}`,
        AdSoyad: person.fullName,
        FirmaAdi: 'Demo Şirket',
        BolumAdi: person.department,
        Pozisyon: person.position,
        GecisZamani: `${todayString}T${timeString}`,
        TerminalAdi: `Terminal ${index + 1}`,
        Gecis: Math.random() > 0.3 ? 1 : 2,
        FotoImage: ''
      };
    });
  }
}