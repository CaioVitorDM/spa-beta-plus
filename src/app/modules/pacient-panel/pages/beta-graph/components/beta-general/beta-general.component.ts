import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {
  CustomSelectComponent,
  ItemSelect,
} from 'src/app/components/custom-select/custom-select.component';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {catchError, EMPTY, Subscription, throwError} from 'rxjs';
import {PatientService} from 'src/app/modules/doctor-panel/pages/pacient/services/patient.service';
import {Direction, Page} from 'src/app/models/ApiResponse';
import {AuthService} from 'src/app/services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {PatientList, User} from 'src/app/models/User';
import {MatDialog} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import swal from 'sweetalert2';
import {BetaEditComponent} from '../beta-edit/beta-edit.component';
import { Beta, BetaList } from 'src/app/models/Beta';
import { BetaService } from 'src/app/services/beta/beta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beta-general',
  templateUrl: './beta-general.component.html',
  styleUrls: ['./beta-general.component.scss'],
})
export class BetaGeneralComponent implements OnInit {
  betaData!: BetaList[];
  patientData!: BetaList[];


  loadBetaSubscription = new Subscription();
  deleteBetaSubscription = new Subscription();

  isLoading: boolean = false;
  isError: boolean = false;

  sort: keyof BetaList = 'betaDate';
  order = Direction.DESC;
  page = 0;
  pageBySize = 0;
  size = 10;
  betaDate: string | null = '';
  betaValue: number | null = 0;
  id: number | null = 0;

  offSet = 0;
  lastItem = 0;
  totalItems = 0;

  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;
  firstDate: string | null = null;
  lastDate: string | null = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    // private headerService: HeaderService,
    private patientService: PatientService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private lineLoadingService: LineLoadingService,
    // private route: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private headerService: HeaderService,
    private betaService: BetaService,
    private route: ActivatedRoute,
  ) {}

  paginatorItems: ItemSelect[] = [
    {value: 10, label: '10 por página'},
    {value: 30, label: '30 por página'},
    {value: 50, label: '50 por página'},
  ];

  pageNumber: ItemSelect[] = [{value: 0, label: 'Página 1'}];
  selectedPaginator = this.paginatorItems[0];
  selectedPage = this.pageNumber[0];


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || this.page;
      this.size = params['size'] || this.size;
      this.sort = params['sort'] || this.sort;
      this.betaDate = params['betaDate'] || this.betaDate;
      this.betaValue = params['betaValue'] || this.betaValue;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }
      this.cdr.detectChanges();
      this.fetchData();
    });
  }

  edit(id: number) {
    const dialogRef = this.dialog.open(BetaEditComponent, {
      data: { id: id }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Beta editado:', result);
      }
    });
  }

  
  handleSelectedPage(item: ItemSelect) {
    if (!this.isFirstRender) {
      this.page = item.value as number;
      this.selectedPage = this.pageNumber[this.page];
    }
    this.fetchData();
    this.isFirstRender = false;
  }

  handleSelectedItem(item: ItemSelect) {
    if (!this.isFirstRender) {
      this.size = item.value as number;
      this.page = 0;
      this.selectedPage = this.pageNumber[this.page];
      this.fetchData();
    }

    this.isFirstRender = false;
  }

  fetchData() {
    this.loadBetaSubscription = this.betaService
      .list({
        page: this.page,
          size: this.size,
          sort: this.sort,
          order: this.order,
          patientId: this.authService.patientId!,
          betaDate: this.betaDate!,
          betaValue: this.betaValue!,
          id:this.id!,
          doctorId:this.authService.doctorId!,
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
  }

  //Lembrando que esse é o segundo delete, talvez precise ajustar
  deleteBeta(id: number) {
    this.lineLoadingService.show();
    this.deleteBetaSubscription = this.betaService
      .delete(id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response.success) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'O exame foi deletado!',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
          this.fetchData();
        }
      });
  }

  onSuccess(beta: Page<Beta[]>) {
    this.isLoading = false;
    this.isError = false;

    if (beta.content.length === 0) {
      this.betaData = [];  
      return;
    }

    this.betaData = beta.content.map((user): BetaList => {
      return {
        patientId: user.patientId,
        betaDate: user.betaDate || '',
        betaValue: user.betaValue || 0,
        id: user.id || 0,
      };
    });

    this.totalItems = beta.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
    this.isFirstPage = beta.first;
    this.isLastPage = beta.last;
    this.offSet = beta.pageable.offset + 1;

    if (!beta.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = beta.totalElements;
    }
    this.lineLoadingService.hide();
  }


  filterPatients(): void {
    if (this.firstDate && this.lastDate) {
      const firstDate = new Date(this.firstDate + 'T00:00:00');
      const lastDate = new Date(this.lastDate + 'T23:59:59');
      if (lastDate < firstDate) {
        swal.fire({
          title: 'Erro!',
          text: 'A última data deve ser maior ou igual à primeira data.',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
        throwError(() => new Error());
        return;
      }

      this.isLoading = true;
      const filteredData = this.betaData.filter((patient) => {
        const patientDate = new Date(patient.betaDate);
        return patientDate >= firstDate && patientDate <= lastDate;
      });
      this.patientData = filteredData;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } else {
      console.log('First Date or Last Date is null');
    }
  }

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

}
