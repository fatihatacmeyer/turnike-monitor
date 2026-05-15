import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { APP_CONFIG, AppConfig } from './app/core/services/app-config.service';

async function bootstrap() {
  // 1. Runtime config'i yükle (environment.ts ile merge)
  let config: AppConfig;
  try {
    const response = await fetch('assets/config.json');
    const runtimeConfig: Partial<AppConfig> = await response.json();
    config = { ...environment, ...runtimeConfig };
  } catch {
    console.warn('config.json bulunamadı, environment.ts varsayılanları kullanılıyor.');
    config = environment as AppConfig;
  }

  // 2. Mock modu için localStorage seed
  if (config.isMockEnabled) {
    const key = `${config.appVersion}-${config.USERDATA_KEY}`;
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

  // 3. Bootstrap ile APP_CONFIG token'ını provide et
  bootstrapApplication(App, {
    providers: [
      ...appConfig.providers,
      { provide: APP_CONFIG, useValue: config }
    ]
  }).catch((err) => console.error(err));
}

bootstrap();
