import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// Seed localStorage with mock auth data when mock mode is enabled
if (environment.isMockEnabled) {
  const key = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  const existing = localStorage.getItem(key);
  if (!existing) {
    const mockAuth = {
      id: 1, loginname: 'ekran', extloginname: '', access: 'full', accessmenu: true,
      admin: false, bolum: 1, customerName: 'Demo Müşteri', customerCode: 'DEMO',
      islemno: '1', kademe: 1, xsicilid: 1, tokenid: 'mock-token-2026',
      yetki: 1, gorev: 1, terminalgrubu: 0, terminalgroup: 0, islemsonuc: 1
    };
    localStorage.setItem(key, JSON.stringify(mockAuth));
  }
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
