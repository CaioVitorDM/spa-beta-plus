import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PatientList } from '../protocols-form/protocols-form.component';

@Component({
  selector: 'app-patients-selector',
  templateUrl: './patients-selector.component.html',
  styleUrl: './patients-selector.component.scss'
})
export class PatientsSelectorComponent {
  @Input() patients: PatientList[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cd.detectChanges(); 
  }

  toggleAll(selected: boolean) {
    this.patients.forEach(patient => patient.selected = selected);
  }

  onAllChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.toggleAll(checkbox.checked);
  }
}
