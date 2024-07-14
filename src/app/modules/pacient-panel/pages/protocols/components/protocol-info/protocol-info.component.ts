import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { Protocol } from 'src/app/models/Protocol';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-protocol-info',
  templateUrl: './protocol-info.component.html',
  styleUrl: './protocol-info.component.scss'
})
export class ProtocolInfoComponent implements OnInit{

  @Input() protocol?: number;
  private protocolDataSubject = new BehaviorSubject<Protocol | null>(null);
  protocolData$ = this.protocolDataSubject.asObservable();  

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private protocolService: ProtocolService,
  ) {  }
  
  ngOnInit(): void {
    if (this.protocol) {
      this.loadProtocol(this.protocol);
    }
  }

  loadProtocol(id: number): void {
    this.protocolService.getOne(id).subscribe({
      next: (protocol) => {
        this.protocolDataSubject.next(protocol);  // Atualiza o BehaviorSubject
      },
      error: (err) => {
        console.error('Failed to load protocol data:', err);
      }
    });
  }

}
