import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HelperService } from '../../core/services/helper.service';
import { TurnikeService } from '../../core/services/turnike.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './display.html',
  styleUrl: './display.scss'
})
export class DisplayComponent implements OnInit {
  data: any[] = [];
  gridCount: number = 1;

  constructor(
    public helper: HelperService,
    private turnikeService: TurnikeService
  ) {}

  ngOnInit(): void {
    this.gridCount = Number(this.helper.selectedGridCount) || 1;
    this.loadData();
  }

  loadData(): void {
    const token = this.helper.userLoginModel?.tokenid;
    const terminalId = this.helper.selectedTerminalId;
    if (!token || !terminalId) return;
    this.turnikeService.getTurnike(token, terminalId).subscribe({
      next: (res) => {
        this.data = Array.isArray(res) ? res.map((p, idx) => ({
          ...p,
          // Eğer fotoğraf yoksa test için rastgele bir yüz görseli ekleyelim
          FotoImage: p.FotoImage || `https://i.pravatar.cc/500?u=${p.SicilNo || idx}`
        })) : [];
      },
      error: (err) => {
        console.error('Turnike verisi yüklenirken hata:', err);
        this.data = [];
      }
    });
  }

  get displayData(): any[] {
    const sorted = [...this.data].sort((a, b) => {
      const timeA = new Date(a.GecisZamani).getTime();
      const timeB = new Date(b.GecisZamani).getTime();
      return timeB - timeA;
    });
    return sorted.slice(0, this.gridCount);
  }

  getGridClass(): string {
    const count = this.gridCount;
    if (count === 1) return 'grid-1';
    if (count === 2) return 'grid-2';
    if (count === 3) return 'grid-3';
    if (count === 4) return 'grid-4';
    if (count === 5) return 'grid-5';
    return 'grid-6';
  }
}
