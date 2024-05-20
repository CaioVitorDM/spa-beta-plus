import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';

@Component({
  selector: 'app-patients-selector',
  templateUrl: './patients-selector.component.html',
  styleUrl: './patients-selector.component.scss'
})
export class PatientsSelectorComponent implements OnInit {
  patients: PatientList[] = [];

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
  
    this.patients = [
      { id: 1, name: 'Carla Medeiros lLALALLALSFAFAS', login: 'carla.medeiros', selected: false },
      { id: 2, name: 'Luísa Almeida', login: 'luisa.almeida', selected: false },
      { id: 3, name: 'João Silva', login: 'joao.silva', selected: false },
      { id: 4, name: 'Ana Pereira', login: 'ana.pereira', selected: false }
    ];
  }

  toggleAll(selected: boolean) {
    this.patients.forEach(patient => patient.selected = selected);
  }

  onAllChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.toggleAll(checkbox.checked);
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
  id: number;
  name: string;
  login: string;
  selected?: boolean; 
}

