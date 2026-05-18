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
    private changeDetector: ChangeDetectorRef // Ekranı güncel tutmak için eklendi
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
    this.pollingSubscription = timer(0, 1000).pipe(
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
      
      if (Array.isArray(apiResponse)) {
        this.data = apiResponse.map((personRecord, personIndex) => ({
          ...personRecord,
          FotoImage: personRecord.FotoImage || `https://i.pravatar.cc/500?u=${personRecord.SicilNo || personIndex}`
        }));
      } else {
        this.data = [];
      }

      // KESİN ÇÖZÜM: Angular'a verinin değiştiğini bildir ve HTML'i anında yeniden çizdir
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  get displayData(): any[] {
    const sortedData = [...this.data].sort((a, b) => {
      const timeA = new Date(a.GecisZamani).getTime();
      const timeB = new Date(b.GecisZamani).getTime();
      return timeB - timeA;
    });
    return sortedData.slice(0, this.gridCount);
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