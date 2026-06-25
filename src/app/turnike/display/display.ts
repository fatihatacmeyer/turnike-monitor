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
  styleUrl: './display.scss',
})
export class DisplayComponent implements OnInit, OnDestroy {
  displayData: any[] = [];
  gridCount: number = 1;
  private pollingSubscription: Subscription | null = null;

  constructor(
    public helper: HelperService,
    private turnikeService: TurnikeService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!this.helper.selectedTerminalId) {
      this.router.navigate(['/home']);
      return;
    }

    this.gridCount = Number(this.helper.selectedGridCount) || 1;
    this.displayData = Array(this.gridCount).fill(null);
    this.startPolling();
  }

  private startPolling(): void {
    this.pollingSubscription = timer(0, 2000)
      .pipe(
        switchMap(() => {
          const userToken = this.helper.userLoginModel?.tokenid;
          const terminalId = this.helper.selectedTerminalId;

          if (!userToken || !terminalId) return of([]);

          return this.turnikeService.getTurnike(userToken, terminalId).pipe(
            catchError((apiError) => {
              console.error('API Error:', apiError);
              return of([]);
            }),
          );
        }),
        catchError((pollingError) => {
          console.error('Polling Error:', pollingError);
          return of([]);
        }),
      )
      .subscribe((response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          const sortedData = [...response].sort((a, b) => {
            const timeA = new Date(a.GecisZamani).getTime();
            const timeB = new Date(b.GecisZamani).getTime();
            return timeB - timeA;
          });

          const terminalAd = this.helper.selectedTerminalAd || sortedData[0]?.TerminalAdi || '';

          this.displayData = sortedData.slice(0, this.gridCount).map((record) => ({
            ...record,
            //_TerminalName: terminalAd
          }));

          while (this.displayData.length < this.gridCount) {
            this.displayData.push(null);
          }
        } else {
          this.displayData = Array(this.gridCount).fill(null);
        }

        this.changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
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
