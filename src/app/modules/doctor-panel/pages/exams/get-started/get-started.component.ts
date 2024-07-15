import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subscription, catchError, forkJoin, map, of} from 'rxjs';
import {ItemSelect} from 'src/app/components/custom-select/custom-select.component';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {Direction, Page} from 'src/app/models/ApiResponse';
import {Exams, ExamsList, ExamsListOfPatients} from 'src/app/models/Exams';
import {AuthService} from 'src/app/services/auth/auth.service';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {PatientService} from 'src/app/services/patient/patient.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss',
})
export class GetStartedComponent {
  examsData!: ExamsListOfPatients[];

  loadExamsSubscription = new Subscription();
  deleteExamSubscription = new Subscription();

  isLoading: boolean = false;
  isError: boolean = false;

  sort: keyof ExamsList = 'examDate';
  order = Direction.DESC;
  page = 0;
  pageBySize = 0;
  size = 10;
  name: string | null = '';
  examDate: string | null = '';
  examType: string | null = '';
  fileId: number | null = 0;
  id: number | null = 0;
  patientId: number | null = 0;
  patientInfo: String | null = '';

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
    private authService: AuthService,
    private snackbar: SnackbarService,
    private examsService: ExamsService,
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute,
    private patient: PatientService
  ) {
    this.headerService.setTitulo('Exames');
  }

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Exame'},
    {value: 'examType', label: 'Tipo'},
    {value: 'examDate', label: 'Data'},
    {value: 'patientInfo', label: 'Nome'},
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
      this.patientId = params['patientId'] || this.patientId;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      this.fetchData();
    });
  }

  openUpload() {
    this.router.navigate(['/doctor-panel/exams/upload-exams'], {relativeTo: this.activatedRoute});
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'name') {
      this.name = searchText;
      this.examDate = '';
      this.examType = '';
      this.patientInfo = '';
    }
    if (searchType === 'examDate') {
      this.examDate = searchText;
      this.name = '';
      this.examType = '';
      this.patientInfo = '';

    }
    if (searchType === 'examType') {
      this.examType = searchText;
      this.name = '';
      this.examDate = '';
      this.patientInfo = '';
    }
    if (searchType === 'patientInfo') {
      this.patientInfo = searchText;
      this.examType = '';
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
    this.loadExamsSubscription = this.examsService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        name: this.name!,
        patientId: this.authService.patientId!,
        examDate: this.examDate!,
        examType: this.examType!,
        fileId: this.fileId!,
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
        next: (exams) => {
          this.onSuccess(exams);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  deleteExam(id: number) {
    this.lineLoadingService.show();
    this.deleteExamSubscription = this.examsService
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

  onSuccess(exams: Page<Exams[]>) {
    this.isLoading = false;
    this.isError = false;

    if (exams.content.length === 0) {
      this.examsData = [];
      this.lineLoadingService.hide();
      return;
    }

    const patientDetails$ = exams.content.map(exam =>
      this.patient.getPatientDetails(exam.patientId).pipe(
        catchError(() => of({ data: { name: 'Desconhecido' }})), 
        map(response => ({
          ...exam,
          patientInfo: response.data.name || 'Desconhecido' 
        }))
      )
    );
  
    forkJoin(patientDetails$).subscribe(fullexams => {
      this.examsData = fullexams.map((exam): ExamsListOfPatients => ({
        id: exam.id,
        patientInfo: exam.patientInfo,
        examDate: exam.examDate || '',
        patientId: exam.patientId,
        doctorId: exam.doctorId,
        fileId: exam.fileId || 0,
        name: exam.name || '',
        examType: exam.examType || '',
      }));
    });

    // this.examsData = exams.content.map((user): ExamsList => {
    //   return {
    //     patientId: user.patientId,
    //     doctorId: user.doctorId,
    //     fileId: user.fileId || 0,
    //     name: user.name || '',
    //     examDate: user.examDate || '',
    //     examType: user.examType || '',
    //     id: user.id || 0,
    //   };
    // });

    // if (this.patientId) {
    //   this.loadName(this.patientId); // Chama o método loadName
    // }

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

  loadName(patientId: number) {
    this.patient.getPatientDetails(patientId).pipe(
      catchError(() => of({data: {name: 'Desconhecido'}})),
      map((response) => ({
        patientInfo: response.data.name || 'Desconhecido',
      }))
    );
  }
}
