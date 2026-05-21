import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  userLoginModel: any = {
    customerCode: '', fullname: '', username: '', loginname: '',
    gorev: null, yetki: null, bolum: null, kademe: null, xsicilid: null,
    extloginname: '', customerName: '', id: null, tokenid: '',
    islemno: '', access: '', accessmenu: true, admin: false
  };

  selectedGridCount: number = 1;
  selectedTerminalId: any = null;
  selectedTerminalAd: string = '';
  selectedTerminal: any = null;
  selectedTerminals: any[] = [];

  requestModel: any = {
    grupadi: '', grupid: null, terminaladi: '', terminalid: null,
    Yetkili1: '', Yetkili2: ''
  };

  constructor() {}
}
