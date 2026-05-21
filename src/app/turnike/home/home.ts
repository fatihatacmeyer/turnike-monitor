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
    private changeDetector: ChangeDetectorRef // Ekranı anında güncellemek için eklendi
  ) {}

  ngOnInit(): void {
    this.loadTerminals();
  }

  loadTerminals() {
    const userToken = this.helper.userLoginModel?.tokenid;
    
    // Güvenlik: Eğer token uçtuysa direkt login'e at
    if (!userToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.turnikeService.getTerminal(userToken).subscribe({
      next: (apiResponse) => {
        this.terminals = Array.isArray(apiResponse) ? apiResponse : [];
        
        if (this.terminals.length > 0) {
          this.selectedTerminal = this.terminals[0];
        }

        // ÇÖZÜM: Angular'a verinin geldiğini ve arayüzü anında çizmesi gerektiğini bildiriyoruz.
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Terminal yüklenirken hata:', error);
      }
    });
  }

  goToTurnike() {
    if (!this.selectedTerminal) {
      return;
    }
    
    this.helper.selectedGridCount = this.selectedGrid;
    // Farklı API versiyonlarında Id veya TerminalID dönebilir, ikisini de yakalıyoruz
    this.helper.selectedTerminalId = this.selectedTerminal.Id || this.selectedTerminal.TerminalID;
    this.helper.selectedTerminalAd = this.selectedTerminal.Ad || this.selectedTerminal.TerminalAdi;
    this.helper.selectedTerminal = this.selectedTerminal;
    
    this.router.navigate(['/turnike']);
  }

  logout() {
    this.authService.logout();
  }
}