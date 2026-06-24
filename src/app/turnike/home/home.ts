import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../core/services/helper.service';
import { TurnikeService } from '../../core/services/turnike.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  selectedGrid: number = 1;
  gridCount = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
  terminals: any[] = [];
  selectedTerminal: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public helper: HelperService,
    private turnikeService: TurnikeService,
    private changeDetector: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadTerminals();
  }

  loadTerminals() {
    const userToken = this.helper.userLoginModel?.tokenid;
    
    if (!userToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.turnikeService.getTerminal(userToken).subscribe({
      next: (apiResponse) => {
        this.terminals = Array.isArray(apiResponse) ? apiResponse : [];
        
        if (this.terminals.length > 0) {
          const savedGrid = localStorage.getItem('savedGridCount');
          const savedTerminalId = localStorage.getItem('savedTerminalId');

          if (savedGrid) {
            this.selectedGrid = parseInt(savedGrid, 10);
          }

          if (savedTerminalId) {
            const found = this.terminals.find(t => 
              (t.Id || t.TerminalID) == parseInt(savedTerminalId, 10)
            );
            if (found) {
              this.selectedTerminal = found;
            }
          }
        }

        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Terminal yüklenirken hata:', error);
      }
    });
  }

  goToTurnike() {
    if (!this.selectedTerminal) {
      alert('Lütfen bir cihaz seçin.');
      return;
    }

    this.helper.selectedGridCount = this.selectedGrid;
    this.helper.selectedTerminalId = this.selectedTerminal.Id || this.selectedTerminal.TerminalID;
    this.helper.selectedTerminalAd = this.selectedTerminal.Ad || this.selectedTerminal.TerminalAdi;

    localStorage.setItem('savedGridCount', this.selectedGrid.toString());
    if (this.helper.selectedTerminalId) {
      localStorage.setItem('savedTerminalId', String(this.helper.selectedTerminalId));
    }

    this.router.navigate(['/turnike']);
  }

  logout() {
    this.authService.logout();
  }
}
