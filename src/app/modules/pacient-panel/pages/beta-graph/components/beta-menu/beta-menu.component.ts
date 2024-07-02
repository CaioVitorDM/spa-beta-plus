import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Filler } from 'chart.js';
import { Beta } from 'src/app/models/Beta'; 
import { BetaService } from 'src/app/services/beta/beta.service'; // Importe seu serviço Beta aqui
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-beta-menu',
  templateUrl: './beta-menu.component.html',
  styleUrls: ['./beta-menu.component.scss'],
})
export class BetaMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  betaData!: Beta[]; // Array que armazenará os dados de Beta
  betaDate!: string;
  betaValue!: number;

  constructor(private betaService: BetaService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.fetch();
  }

  fetch() {
    this.betaService
      .list({ betaDate: this.betaDate, betaValue: this.betaValue }) // Configure os parâmetros conforme necessário
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar dados do Beta:', error);
          // Trate o erro conforme necessário
          return EMPTY;
        })
      )
      .subscribe((beta) => {
        this.betaData = beta; // Atualize o array de betaData com os dados recebidos
        this.initializeGraph();
      });
  }

  initializeGraph() {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Filler);

    const labels = this.betaData.map((beta) => beta.betaDate); // Array de datas
    const data = this.betaData.map((beta) => beta.betaValue); // Array de valores de beta

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nível do Beta hCG',
            data: data,
            fill: true,
            backgroundColor: 'rgba(151, 92, 228, 0.13)',
            borderColor: 'rgba(151, 92, 228, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151, 92, 228, 1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
}
