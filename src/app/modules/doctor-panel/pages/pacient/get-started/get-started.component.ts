import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemSelect} from '../../../../../components/custom-select/custom-select.component';
import {HeaderService} from '../../../../../services/header/header-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY, Subscription} from 'rxjs';
import {PatientService} from '../services/patient.service';
import {Direction, Page} from '../../../../../models/ApiResponse';
import {AuthService} from '../../../../../services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from '../../../../../constants/messages';
import {SnackbarService} from '../../../../../services/snackbar/snackbar.service';
import {LineLoadingService} from '../../../../../services/line-loading/line-loading.service';
import {PatientList, User} from '../../../../../models/User';
import swal from 'sweetalert2';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss',
})
export class GetStartedComponent implements OnInit {
  patientData!: PatientList[];
  loadPatientsSubscription = new Subscription();
  deletePatientSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof PatientList = 'createdAt';
  order = Direction.DESC;
  name: string | null = '';
  email: string | null = '';
  phoneNumber: string | null = '';

  offSet = 0;
  lastItem = 0;
  totalItems = 0;

  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute
  ) {
    this.headerService.setTitulo('Pacientes');
  }

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
    {value: 'phoneNumber', label: 'Telefone'},
    {value: 'email', label: 'Email'},
  ];

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
      this.email = params['email'] || this.email;
      this.name = params['name'] || this.name;
      this.phoneNumber = params['phoneNumber'] || this.phoneNumber;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      this.fetchData();
    });
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'name') {
      this.name = searchText;
      this.email = '';
      this.phoneNumber = '';
    }
    if (searchType === 'email') {
      this.email = searchText;
      this.name = '';
      this.phoneNumber = '';
    }
    if (searchType === 'phoneNumber') {
      this.phoneNumber = searchText;
      this.name = '';
      this.email = '';
    }

    this.page = 0;

    this.fetchData();
  }

  cleanSearch() {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';

    this.fetchData();
  }

  navigateToCreatePage() {
    this.router.navigate(['/doctor-panel/patients/create'], {relativeTo: this.activatedRoute});
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

  deletePatient(id: number) {
    this.lineLoadingService.show();
    this.deletePatientSubscription = this.patientService
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
          swal.fire({
            title: 'Sucesso!',
            text: 'O usuário foi deletado!',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
          this.fetchData();
        }
      });
  }
}
