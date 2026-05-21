import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HelperService } from '../../core/services/helper.service';
import { TurnikeService } from '../../core/services/turnike.service';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './display.html',
  styleUrl: './display.scss'
})
export class DisplayComponent implements OnInit, OnDestroy {
  data: any[] = [];
  gridCount: number = 1;
  private pollingSubscription: Subscription | null = null;

  constructor(
    public helper: HelperService,
    private turnikeService: TurnikeService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.helper.selectedTerminalId) {
      this.router.navigate(['/home']);
      return;
    }

    this.gridCount = Number(this.helper.selectedGridCount) || 1;
    this.startPolling();
  }

  private startPolling(): void {
    this.pollingSubscription = timer(0, 2000).pipe(
      switchMap(() => {
        const userToken = this.helper.userLoginModel?.tokenid;
        const activeTerminalId = this.helper.selectedTerminalId;
        
        if (!userToken || !activeTerminalId) return of([]);
        
        return this.turnikeService.getTurnike(userToken, activeTerminalId).pipe(
          catchError(apiError => {
            console.error('API Error:', apiError);
            return of([]);
          })
        );
      }),
      catchError(pollingError => {
        console.error('Polling Error:', pollingError);
        return of([]);
      })
    ).subscribe((apiResponse) => {
      
      if (Array.isArray(apiResponse) && apiResponse.length > 0) {
        
        // 1. Yeni gelen verileri formatla
        const incomingData = apiResponse.map((personRecord, personIndex) => ({
          ...personRecord,
          FotoImage: personRecord.FotoImage || `https://i.pravatar.cc/500?u=${personRecord.SicilNo || personIndex}`
        }));

        // 2. Yeni gelenlerle eski verileri birleştir (Hafıza Mekanizması)
        const combinedData = [...incomingData, ...this.data];

        // 3. Mükerrer kayıtları (aynı kişinin aynı saniyedeki geçişini) temizle
        const uniqueData: any[] = [];
        const seenKeys = new Set();

        for (const item of combinedData) {
          // Bir kaydı benzersiz yapan şey Sicil Numarası ve Geçiş Zamanıdır
          const uniqueKey = `${item.SicilNo}_${item.GecisZamani}`;
          if (!seenKeys.has(uniqueKey)) {
            seenKeys.add(uniqueKey);
            uniqueData.push(item);
          }
        }

        // 4. Yeniden eskiye doğru sırala (En yeni geçiş en üstte olacak)
        uniqueData.sort((a, b) => {
          const timeA = new Date(a.GecisZamani).getTime();
          const timeB = new Date(b.GecisZamani).getTime();
          return timeB - timeA; // B'den A'yı çıkararak descending (azalan) sıralama yapıyoruz
        });

        // 5. Her zaman maksimum son 6 kişiyi hafızada tut
        this.data = uniqueData.slice(0, 6);

        // Ekranı güncelle
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  get displayData(): any[] {
    // Hafızadaki max 6 kişilik listeden, kullanıcının ekranda seçtiği kadarını kesip gösterir.
    // Eğer gridCount 1 ise sadece en yeni 1 kişiyi, 6 ise hepsini gösterir.
    return this.data.slice(0, this.gridCount);
  }

  getGridClass(): string {
    const currentGridCount = this.gridCount;
    if (currentGridCount === 1) return 'grid-1';
    if (currentGridCount === 2) return 'grid-2';
    if (currentGridCount === 3) return 'grid-3';
    if (currentGridCount === 4) return 'grid-4';
    if (currentGridCount === 5) return 'grid-5';
    return 'grid-6';
  }
}