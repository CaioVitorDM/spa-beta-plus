import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { Direction } from 'src/app/models/ApiResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { User } from 'src/app/models/User';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'app-patients-selector',
  templateUrl: './patients-selector.component.html',
  styleUrls: ['./patients-selector.component.scss', '../../../../../../../assets/css/checkbox.scss']
})
export class PatientsSelectorComponent implements OnInit {
  @Output() patientsSelected = new EventEmitter<number[]>();
  @Input() previousPatientsSelected: number[] = [];

  allSelectedPatientIds: Set<number> = new Set(); // Armazena todos os IDs selecionados
  patients: PatientList[] = [];
  loadPatientsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  message: string = 'Por favor, escolha pelo menos um paciente.';
  
  name: string | null = '';
  login: string | null = '';

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
  ) {}

  searchOptions: ItemSelect[] = [
    { value: 'name', label: 'Nome' },
    { value: 'login', label: 'Login' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || this.name;
      this.login = params['login'] || this.login;

      this.loadPatients();
      // Garanta que os IDs selecionados anteriormente sejam adicionados ao Set
      this.previousPatientsSelected.forEach(id => this.allSelectedPatientIds.add(id));
    });
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'name') {
      this.name = searchText;
      this.login = '';
    }
    if (searchType === 'login') {
      this.login = searchText;
      this.name = '';
    }

    this.loadPatients();
  }

  cleanSearch() {
    this.name = '';
    this.login = '';
    this.loadPatients();
  }

  loadPatients() {
    this.loadPatientsSubscription = this.patientService
      .getPatientsByDoctor({
        name: this.name!,
        login: this.login!,
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
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(patients: User[]) {
    this.isLoading = false;
    this.isError = false;
    this.patients = patients.map((user): PatientList => {
      const isSelected = this.allSelectedPatientIds.has(user.patient?.id || 0);
      return {
        id: user.patient?.id,
        name: user.patient?.name || '',
        login: user.login || '',
        selected: isSelected 
      };
    });
    this.lineLoadingService.hide();
    this.emitSelectedPatients(); 
  }

  onAllChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.toggleAll(checkbox.checked);
    this.emitSelectedPatients();  
  }

  toggleAll(selected: boolean) {
    this.patients.forEach(patient => {
      if (patient.id !== undefined) {
        if (selected) {
          this.allSelectedPatientIds.add(patient.id);
        } else {
          this.allSelectedPatientIds.delete(patient.id);
        }
        patient.selected = selected;
      }
    });
    this.emitSelectedPatients(); 
  }

  emitSelectedPatients() {
    this.patients.forEach(patient => {
      if (patient.selected && patient.id !== undefined) {
        this.allSelectedPatientIds.add(patient.id);
      } else if (!patient.selected && patient.id !== undefined) {
        this.allSelectedPatientIds.delete(patient.id);
      }
    });

    const selectedIds = Array.from(this.allSelectedPatientIds).filter((id): id is number => id !== undefined);
    this.patientsSelected.emit(selectedIds);
    this.checkAllSelected();
    this.message = selectedIds.length === 0 ? 'Por favor, escolha pelo menos um paciente.' : '';
  }

  checkAllSelected() {
    const allSelected = this.patients.every(patient => patient.selected) && this.patients.length > 0;
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allSelected;
    }
  }
}

export interface PatientList {
  id?: number;
  name: string;
  login: string;
  selected?: boolean; 
}