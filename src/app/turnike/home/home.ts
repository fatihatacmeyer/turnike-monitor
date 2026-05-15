import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../core/services/helper.service';
import { TurnikeService } from '../../core/services/turnike.service';
import { AuthService } from '../../core/services/auth.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, FormsModule],
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
    private turnikeService: TurnikeService
  ) {}

  ngOnInit(): void {
    this.loadTerminals();
  }

  loadTerminals() {
    this.turnikeService.getTerminal(this.helper.userLoginModel.tokenid).subscribe({
      next: (data) => {
        this.terminals = data;
      },
      error: (err) => {
        console.error('Terminal yüklenirken hata:', err);
      }
    });
  }

  goToTurnike() {
    if (!this.selectedTerminal) {
      return;
    }
    this.helper.selectedGridCount = this.selectedGrid;
    this.helper.selectedTerminalId = this.selectedTerminal.Id;
    this.helper.selectedTerminalAd = this.selectedTerminal.Ad;
    this.helper.selectedTerminal = this.selectedTerminal;
    this.router.navigate(['/turnike']);
  }

  logout() {
    this.authService.logout();
  }
}
