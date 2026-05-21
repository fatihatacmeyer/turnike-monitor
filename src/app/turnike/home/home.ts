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
  selectedTerminals: any[] = [null];

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
          // Akıllı İlk Yükleme: Terminal sayısı kadar grid seç (Maksimum 6)
          this.selectedGrid = Math.min(this.terminals.length, 6);
          this.selectedTerminals = [];
          
          for (let i = 0; i < this.selectedGrid; i++) {
            this.selectedTerminals.push(this.terminals[i]);
          }
        }

        // ÇÖZÜM: Angular'a verinin geldiğini ve arayüzü anında çizmesi gerektiğini bildiriyoruz.
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Terminal yüklenirken hata:', error);
      }
    });
  }

  onGridChange() {
    const newSelections = [];
    for(let i = 0; i < this.selectedGrid; i++) {
        // Eğer önceden seçili bir değer varsa onu koru, yoksa sıradaki terminali ata
        newSelections.push(this.selectedTerminals[i] || (this.terminals.length > 0 ? this.terminals[i % this.terminals.length] : null));
    }
    this.selectedTerminals = newSelections;
  }

  getGridIndices() {
    return Array.from({length: this.selectedGrid}, (_, i) => i);
  }

  goToTurnike() {
    if (this.selectedTerminals.some(t => t === null)) {
      return;
    }
    
    this.helper.selectedGridCount = this.selectedGrid;
    this.helper.selectedTerminals = [...this.selectedTerminals];
    
    this.router.navigate(['/turnike']);
  }

  logout() {
    this.authService.logout();
  }
}