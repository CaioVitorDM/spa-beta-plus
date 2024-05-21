import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js';

@Component({
  selector: 'app-beta-menu',
  standalone: true,
  imports: [],
  templateUrl: './beta-menu.component.html',
  styleUrls: ['./beta-menu.component.scss']
})
export class BetaMenuComponent implements OnInit, AfterViewInit{
  @ViewChild('lineChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.initializeGraph();
  }

  initializeGraph() {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Filler
    );
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Nível do Beta hCG',
            data: [300, 450, 500, 550, 600, 650, 800, 850, 750, 900, 950, 1000], // Use seus próprios dados
            fill: true,
            backgroundColor: 'rgba(151, 92, 228, 0.13)', // Cor do preenchimento com transparência
            borderColor: 'rgba(151, 92, 228, 1)', // Cor da linha
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151, 92, 228, 1)', // Cor dos pontos
            tension: 0.4, // Suavização da curva da linha
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
