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
          const savedTerminals = localStorage.getItem('savedTerminals');

          if (savedGrid && savedTerminals) {
            // Hafızada kullanıcının eski seçimi varsa onu getir
            this.selectedGrid = parseInt(savedGrid, 10);
            const savedTerminalIds = JSON.parse(savedTerminals);
            
            this.selectedTerminals = [];
            for (let i = 0; i < this.selectedGrid; i++) {
              const foundTerminal = this.terminals.find(t => 
                (t.Id || t.TerminalID) === savedTerminalIds[i]
              );
              this.selectedTerminals.push(foundTerminal || null);
            }
          } else {
            // Otomatik (akıllı) seçimi kaldırdık. 
            // Varsayılan olarak 1 grid ve içi boş (null) gelecek, kullanıcı seçecek.
            this.selectedGrid = 1;
            this.selectedTerminals = [null];
          }
        }

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
        // Yeni bir ekran eklendiğinde otomatik doldurmayı kaldırdık, null (boş) atıyoruz.
        newSelections.push(this.selectedTerminals[i] || null);
    }
    this.selectedTerminals = newSelections;
  }

  getGridIndices() {
    return Array.from({length: this.selectedGrid}, (_, i) => i);
  }

  goToTurnike() {
    // Tüm alanların seçili olup olmadığını kontrol et
    if (this.selectedTerminals.some(t => t === null)) {
      alert("Lütfen izlemek için tüm ekranlara bir terminal seçin.");
      return;
    }
    
    this.helper.selectedGridCount = this.selectedGrid;
    this.helper.selectedTerminals = [...this.selectedTerminals];
    
    localStorage.setItem('savedGridCount', this.selectedGrid.toString());
    
    const terminalIds = this.selectedTerminals.map(t => t.Id || t.TerminalID);
    localStorage.setItem('savedTerminals', JSON.stringify(terminalIds));
    
    this.router.navigate(['/turnike']);
  }

  logout() {
    this.authService.logout();
  }
}