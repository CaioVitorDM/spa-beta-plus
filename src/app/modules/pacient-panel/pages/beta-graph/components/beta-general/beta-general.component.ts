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
import { BetaEditComponent } from '../beta-edit/beta-edit.component';


@Component({
  selector: 'app-beta-general',
  templateUrl: './beta-general.component.html',
  styleUrls: ['./beta-general.component.scss'],
})
export class BetaGeneralComponent implements OnInit {
  @Input() dataSource: PatientList[] = [];
  sortOrder: 'asc' | 'desc' = 'desc';
  patientData: PatientList[] = [];
  originalData: PatientList[] = [];

  loadPatientsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  sort: keyof PatientList = 'createdAt';
  order = Direction.DESC;
  page = 0;
  pageBySize = 0;
  size = 10;
  name: string | null = '';
  email: string | null = '';
  phoneNumber: string | null = '';

  firstDate: string | null = null;
  lastDate: string | null = null;

  offSet = 0;
  lastItem = 0;
  totalItems = 0;

  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;

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
    private cdr: ChangeDetectorRef
  ) {}

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
    {value: 'phoneNumber', label: 'Tipo'},
    {value: 'email', label: 'Data'},
  ];

  paginatorItems: ItemSelect[] = [
    {value: 10, label: '10 por página'},
    {value: 30, label: '30 por página'},
    {value: 50, label: '50 por página'},
  ];

  pageNumber: ItemSelect[] = [{value: 0, label: 'Página 1'}];
  selectedPaginator = this.paginatorItems[0];
  selectedPage = this.pageNumber[0];

  ngOnInit(): void {
    // Mocking data
    this.dataSource = [
      {
        id: 1,
        createdAt: '2023-05-20T10:00:00Z',
        name: '500',
        birthDate: '2024-04-05',
        phoneNumber: '123-456-7890',
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        createdAt: '2023-05-21T10:00:00Z',
        name: '1000',
        birthDate: '2024-03-05',
        phoneNumber: '987-654-3210',
        email: 'jane.smith@example.com',
      },
      {
        id: 3,
        createdAt: '2023-05-22T10:00:00Z',
        name: '1500',
        birthDate: '2024-05-05',
        phoneNumber: '555-555-5555',
        email: 'alice.johnson@example.com',
      },
    ];

    this.patientData = this.dataSource;
    this.originalData = [...this.dataSource];
    this.cdr.detectChanges();
    // Ordena por padrão de forma decrescente
    this.fetchData();
    this.sortByBirthDate();
  }

  sortByBirthDate(): void {
    this.dataSource.sort((a, b) => {
      const dateA = new Date(a.birthDate).getTime();
      const dateB = new Date(b.birthDate).getTime();

      if (this.sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortByBirthDate();
  }

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

  editUser() : void{
    this.dialog.open(BetaEditComponent);
  }

  deleteUser(id: number) {
    console.log('delete ' + id);
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
    this.loadPatientsSubscription = this.patientService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        name: this.name!,
        email: this.email!,
        phoneNumber: this.phoneNumber!,
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
        next: (patients) => {
          this.onSuccess(patients);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(patients: Page<User[]>) {
    this.isLoading = false;
    this.isError = false;
    this.patientData = patients.content.map((user): PatientList => {
      return {
        id: user.id,
        createdAt: user.patient?.birthDate || '',
        name: user.patient?.name || '',
        birthDate: user.patient?.birthDate || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
      };
    });
    this.patientData = [...this.originalData];
    this.totalItems = patients.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
    this.isFirstPage = patients.first;
    this.isLastPage = patients.last;
    this.offSet = patients.pageable.offset + 1;

    if (!patients.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = patients.totalElements;
    }
    this.lineLoadingService.hide();
  }

  filterPatients(): void {
    if (this.firstDate && this.lastDate) {
      const firstDate = new Date(this.firstDate + 'T00:00:00');
      const lastDate = new Date(this.lastDate + 'T23:59:59');

      //Testando coisa Inicio
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

      //Testando coisa Fim

      console.log('First Date:', this.firstDate);
      console.log('Last Date:', this.lastDate);
      console.log('Normalized First Date:', firstDate);
      console.log('Normalized Last Date:', lastDate);

      this.isLoading = true;

      const filteredData = this.dataSource.filter((patient) => {
        const patientDate = new Date(patient.birthDate);
        console.log('Patient Date:', patientDate);

        return patientDate >= firstDate && patientDate <= lastDate;
      });

      console.log('Filtered Data:', filteredData);

      this.patientData = filteredData;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } else {
      console.log('First Date or Last Date is null');
    }
  }

}
