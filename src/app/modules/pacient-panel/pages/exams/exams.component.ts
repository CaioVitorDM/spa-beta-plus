import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemSelect} from 'src/app/components/custom-select/custom-select.component';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY, Subscription} from 'rxjs';
import {PatientService} from 'src/app/modules/doctor-panel/pages/pacient/services/patient.service';
import {Direction, Page} from 'src/app/models/ApiResponse';
import {AuthService} from 'src/app/services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {PatientList, User} from 'src/app/models/User';
import {UploadExamsComponent} from './upload-exams/upload-exams.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  patientData!: PatientList[];
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
    this.headerService.setTitulo('Exames');
  }

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

  openUpload() {
    this.router.navigate(['/patient-panel/upload-exams']);
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
}
