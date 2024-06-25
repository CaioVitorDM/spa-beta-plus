import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemSelect} from 'src/app/components/custom-select/custom-select.component';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY, Subscription, switchMap} from 'rxjs';
import {Direction, Page} from 'src/app/models/ApiResponse';
import {AuthService} from 'src/app/services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {PatientList, User} from 'src/app/models/User';
import {MatDialog} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {UploadExamsComponent} from '../upload-exams/upload-exams.component';
import {ExamsRoutes} from '../exams.routes';
import { Exams, ExamsList } from 'src/app/models/Exams';
import { ExamsService } from 'src/app/services/exams/exams.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss',
})
export class GetStartedComponent implements OnInit {
  // patientData!: PatientList[];
  examsData!: ExamsList[];

  loadExamsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  sort: keyof ExamsList = 'examDate';
  order = Direction.DESC;
  page = 0;
  pageBySize = 0;
  size = 10;
  name: string | null = '';
  // email: string | null = '';
  // phoneNumber: string | null = '';
  examDate: string | null = '';
  examType: string | null = '';
  fileId: number | null = 0;

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
    private examsService: ExamsService,
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute
  ) {
    this.headerService.setTitulo('Exames');
  }

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
    {value: 'examType', label: 'Tipo'},
    {value: 'examDate', label: 'Data'},
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
      this.examDate = params['examDate'] || this.examDate;
      this.name = params['name'] || this.name;
      this.examType = params['examType'] || this.examType;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      this.fetchData();
    });
  }

  openUpload() {
    this.router.navigate(['/patient-panel/exams/upload-exams'], {relativeTo: this.activatedRoute});
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'name') {
      this.name = searchText;
      this.examDate = '';
      this.examType = '';
    }
    if (searchType === 'examDate') {
      this.examDate = searchText;
      this.name = '';
      this.examType = '';
    }
    if (searchType === 'examType') {
      this.examType = searchText;
      this.name = '';
      this.examDate = '';
    }

    this.page = 0;

    this.fetchData();
  }

  cleanSearch() {
    this.name = '';
    this.examDate = '';
    this.examType = '';

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
    this.loadExamsSubscription = this.patientService.getPatientDetails(this.authService.patientId!).
    pipe(
      switchMap(patientDetails => {
        return this.examsService.list({
          page: this.page,
          size: this.size,
          sort: this.sort,
          order: this.order,
          name: this.name!,
          patientId: this.authService.patientId!,
          examDate: this.examDate!,
          examType: this.examType!,
          fileId:this.fileId!,
        });
      })
    )  .subscribe({
        next: (exams) => {
          this.onSuccess(exams);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }


  onSuccess(exams: Page<Exams[]>) {
    this.isLoading = false;
    this.isError = false;

    if (exams.content.length === 0) {
      this.examsData = [];  
      return;
    }

    this.examsData = exams.content.map((user): ExamsList => {
      return {
        patientId: user.patientId,
        fileId: user.fileId || 0,
        name: user.name || '',
        examDate: user.examDate || '',
        examType: user.examType || '',
      };
    });

    this.totalItems = exams.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
    this.isFirstPage = exams.first;
    this.isLastPage = exams.last;
    this.offSet = exams.pageable.offset + 1;

    if (!exams.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = exams.totalElements;
    }
    this.lineLoadingService.hide();
  }
}
