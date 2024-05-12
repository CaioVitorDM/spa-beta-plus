import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {LineLoadingService} from '../../../../services/line-loading/line-loading.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private lineLoadingService: LineLoadingService
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    this.lineLoadingService.hide();
  }
}
