import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { Direction } from 'src/app/models/ApiResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProtocolService } from '../../services/protocol.service';

@Component({
  selector: 'app-patients-selector',
  templateUrl: './patients-selector.component.html',
  styleUrls: ['./patients-selector.component.scss', '../../../../../../../assets/css/checkbox.scss']
})
export class PatientsSelectorComponent implements OnInit {
  @Output() patientsSelected = new EventEmitter<number[]>();
  patients: PatientList[] = [];
  
  message: string = 'Por favor, escolha pelo menos um paciente.';

  constructor(private protocolService: ProtocolService,
              private authService: AuthService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.protocolService
    .getPatientsByDoctorId(this.authService.doctorId!).subscribe({
      next: (data) => {
        this.patients = data.map(user => ({
          id: user.id,
          name: user.patient?.name || 'No Name',
          login: user.login,
          selected: false
        }));
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.message = 'Erro ao carregar pacientes.';
      }
    });
  }
  
onAllChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  this.toggleAll(checkbox.checked);
  this.emitSelectedPatients();  
}

toggleAll(selected: boolean) {
  this.patients.forEach(patient => patient.selected = selected);
  this.emitSelectedPatients(); 
}

emitSelectedPatients() {
  const selectedIds = this.patients
      .filter(patient => patient.selected)  
      .map(patient => patient.id)           
      .filter(id => id !== undefined);      
  
  this.patientsSelected.emit(selectedIds as number[]); 
  this.checkAllSelected(); 
  this.message = selectedIds.length === 0 ? 'Por favor, escolha pelo menos um paciente.' : '';
}

checkAllSelected() {
  const allSelected = this.patients.every(patient => patient.selected);
  const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = allSelected;
  }
}

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
    {value: 'login', label: 'Login'}
  ];

  submitSearch(searchType: string | number, searchText: string | null): void {
    console.log(searchType);
    console.log(searchText);
  }

  cleanSearch() {
    console.log('cleaned');
  }
}

export interface PatientList {
  id?: number;
  name: string;
  login: string;
  selected?: boolean; 
}

