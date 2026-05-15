import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    { Id: 4, Ad: 'Terminal-4 (Ziyaretçi)' }
  ];

  private personelNames = [
    { AdSoyad: 'Ahmet Yılmaz', Departman: 'IT', Pozisyon: 'Yazılım Geliştirici' },
    { AdSoyad: 'Ayşe Demir', Departman: 'İK', Pozisyon: 'İnsan Kaynakları Uzmanı' },
    { AdSoyad: 'Mehmet Kaya', Departman: 'Muhasebe', Pozisyon: 'Muhasebe Müdürü' },
    { AdSoyad: 'Fatma Şahin', Departman: 'Satış', Pozisyon: 'Satış Temsilcisi' },
    { AdSoyad: 'Ali Öztürk', Departman: 'Lojistik', Pozisyon: 'Depo Sorumlusu' },
    { AdSoyad: 'Zeynep Çelik', Departman: 'Pazarlama', Pozisyon: 'Pazarlama Uzmanı' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.config.isMockEnabled) {
      return next.handle(req);
    }

    // Mock MonitorLogin endpoint
    if (req.url.includes('MonitorLogin') || req.url.includes('monitorlogin')) {
      console.log('[Mock] Login:', req.url);
      return of(new HttpResponse({
        status: 200,
        body: [this.mockAuth]
      }));
    }

    // Mock Dynamic endpoint (terminal listing + turnike data)
    if (req.url.includes('Dynamic') || req.url.includes('dynamic')) {
      console.log('[Mock] Dynamic:', req.url);

      const name = req.params.get('Name') || '';

      // Terminal listesi (islemtipi=tl)
      if (name.toLowerCase().includes('islemtipi=tl')) {
        console.log('[Mock] Returning terminals:', this.mockTerminals);
        return of(new HttpResponse({
          status: 200,
          body: this.mockTerminals
        }));
      }

      // Turnike geçiş verisi (islemtipi=pp)
      if (name.toLowerCase().includes('islemtipi=pp')) {
        const mockData = this.generateTurnikeData();
        console.log('[Mock] Returning turnike data:', mockData);
        return of(new HttpResponse({
          status: 200,
          body: mockData
        }));
      }

      // Bilinmeyen Dynamic isteği - yine de boş veri döndür
      console.log('[Mock] Unknown Dynamic request, returning empty:', name);
      return of(new HttpResponse({
        status: 200,
        body: []
      }));
    }

    // Mock modunda eşleşmeyen istekler boş array dönsün (gerçek API'ye düşmesin)
    console.log('[Mock] Unmatched request, returning empty:', req.url);
    return of(new HttpResponse({
      status: 200,
      body: []
    }));
  }

  private generateTurnikeData(): any[] {
    const times = ['09:00:00', '09:01:00', '09:02:00', '09:03:00', '09:04:00', '09:05:00'];
    const today = new Date().toISOString().split('T')[0];
    return this.personelNames.map((person, i) => ({
      Mesaj: 'OK',
      SicilNo: `${1001 + i}`,
      AdSoyad: person.AdSoyad,
      FirmaAdi: 'Demo Şirket',
      BolumAdi: person.Departman,
      Pozisyon: person.Pozisyon,
      GecisZamani: `${today}T${times[i]}`,
      TerminalAdi: `Terminal ${i + 1}`,
      FotoImage: ''
    }));
  }
}
