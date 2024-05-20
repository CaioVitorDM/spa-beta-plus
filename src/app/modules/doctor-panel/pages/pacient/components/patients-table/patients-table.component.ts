import {Component, Input} from '@angular/core';
import {PatientList} from '../../../../../../models/User';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-patients-table',
  templateUrl: './patients-table.component.html',
  styleUrl: './patients-table.component.scss',
})
export class PatientsTableComponent {
  @Input() dataSource: PatientList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

  editUser(id: number) {
    this.router.navigate([`/doctor-panel/patients/edit/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteUser(id: number) {
    console.log('delete ' + id);
  }
}
