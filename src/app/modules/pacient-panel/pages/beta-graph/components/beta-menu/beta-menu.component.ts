import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Filler,
  CategoryScale,
} from 'chart.js';
import {Beta, BetaList} from 'src/app/models/Beta';
import { Page } from 'src/app/models/ApiResponse';
import {BetaService} from 'src/app/services/beta/beta.service';
import {catchError} from 'rxjs/operators';
import {EMPTY, Subscription} from 'rxjs';
import {AuthService} from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';

@Component({
  selector: 'app-beta-menu',
  templateUrl: './beta-menu.component.html',
  styleUrls: ['./beta-menu.component.scss'],
})
export class BetaMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  betaData: Beta[] = []; // Inicializar como array vazio
  betaDate!: string;
  betaValue!: number;
  loadBetaSubscription = new Subscription();

  id: number | null = 0;
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private betaService: BetaService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private lineLoadingService: LineLoadingService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.fetch();
  }

  /*fetchData() {
    this.loadBetaSubscription = this.betaService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        patientId: this.authService.patientId!,
        betaDate: this.betaDate!,
        betaValue: this.betaValue!,
        id: this.id!,
        doctorId: this.authService.doctorId!,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe({
        next: (beta) => {
          this.onSuccess(beta);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  } */

  fetch() {
    this.loadBetaSubscription = this.betaService
      .list({
        patientId: this.authService.patientId!,
        betaDate: this.betaDate!,
        betaValue: this.betaValue!,
        id: this.id!,
        doctorId: this.authService.doctorId!,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe({
        next: (beta) => {
          this.betaData = beta.content
          this.initializeGraph();
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  initializeGraph() {
    this.betaData.sort((a, b) => new Date(a.betaDate).getTime() - new Date(b.betaDate).getTime());

    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Filler, CategoryScale);

    const labels = this.betaData.map((beta) => this.formatDate(beta.betaDate)); // Array de datas
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
