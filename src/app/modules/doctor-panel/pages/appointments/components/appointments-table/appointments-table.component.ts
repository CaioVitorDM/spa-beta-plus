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


  editAppointment(id: number) {
    this.router.navigate([`/doctor-panel/appointments/edit/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteAppointment(id: number) {
    console.log('delete ' + id);
  }

}
