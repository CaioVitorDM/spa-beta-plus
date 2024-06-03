import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentList } from 'src/app/models/Appointment';

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.component.html',
  styleUrl: './appointments-table.component.scss'
})
export class AppointmentsTableComponent {

  @Input() dataSource: AppointmentList[] = [];

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

  editAppointment(id: number) {
    console.log('editar ' + id);
  }

  deleteAppointment(id: number) {
    console.log('delete ' + id);
  }

}
