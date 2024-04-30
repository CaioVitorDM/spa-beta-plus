import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../../../services/header/header-info.service';


@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss',
})
export class PatientDashboardComponent implements OnInit {

 constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.setTitulo('Teste');
    this.headerService.setNumero(3);
  }
}
