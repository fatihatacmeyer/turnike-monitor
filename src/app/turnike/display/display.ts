import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HelperService } from '../../core/services/helper.service';
import { TurnikeService } from '../../core/services/turnike.service';
import { Subscription, timer, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './display.html',
  styleUrl: './display.scss'
})
export class DisplayComponent implements OnInit, OnDestroy {
  displayData: any[] = [];
  gridCount: number = 1;
  private pollingSubscription: Subscription | null = null;
  terminals: any[] = [];

  constructor(
    public helper: HelperService,
    private turnikeService: TurnikeService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.helper.selectedTerminals || this.helper.selectedTerminals.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.gridCount = Number(this.helper.selectedGridCount) || 1;
    this.terminals = this.helper.selectedTerminals;
    
    // Initialize displayData with empty records or nulls
    this.displayData = Array(this.gridCount).fill(null);

    this.startPolling();
  }

  private startPolling(): void {
    this.pollingSubscription = timer(0, 2000).pipe(
      switchMap(() => {
        const userToken = this.helper.userLoginModel?.tokenid;
        
        if (!userToken || this.terminals.length === 0) return of([]);

        const requests = this.terminals.map(terminal => {
            const terminalId = terminal.Id || terminal.TerminalID;
            return this.turnikeService.getTurnike(userToken, terminalId).pipe(
                catchError(apiError => {
                    console.error(`API Error for terminal ${terminalId}:`, apiError);
                    return of([]);
                })
            );
        });

        return forkJoin(requests);
      }),
      catchError(pollingError => {
        console.error('Polling Error:', pollingError);
        return of([]);
      })
    ).subscribe((responses: any[]) => {
      
      if (responses && responses.length > 0) {
          responses.forEach((apiResponse, index) => {
              if (Array.isArray(apiResponse) && apiResponse.length > 0) {
                  const sortedData = [...apiResponse].sort((a, b) => {
                    const timeA = new Date(a.GecisZamani).getTime();
                    const timeB = new Date(b.GecisZamani).getTime();
                    return timeB - timeA;
                  });
                  
                  const latestRecord = sortedData[0];
                  
                  latestRecord.FotoImage = latestRecord.FotoImage || `https://i.pravatar.cc/500?u=${latestRecord.SicilNo || 'default'}`;
                  latestRecord._TerminalName = this.terminals[index].Ad || this.terminals[index].TerminalAdi;
                  
                  this.displayData[index] = latestRecord;
              }
          });

          this.changeDetector.detectChanges();
      }
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