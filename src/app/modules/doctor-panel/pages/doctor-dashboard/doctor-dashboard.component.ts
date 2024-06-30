import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {LineLoadingService} from '../../../../services/line-loading/line-loading.service';
import { ProtocolList } from 'src/app/models/Protocol';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { apiErrorStatusMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent implements OnInit {

  protocols: ProtocolList[] = [];

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private protocolService: ProtocolService,
    private lineLoadingService: LineLoadingService
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    this.lineLoadingService.hide();
    this.loadProtocols();
  }

  private loadProtocols() {
   
    this.protocolService.findByDoctorId(this.authService.doctorId!).subscribe({
      next: (protocols) => this.protocols = protocols,
      error: (error) => this.snackbar.open(apiErrorStatusMessage[error.status])
    });
  }
}
