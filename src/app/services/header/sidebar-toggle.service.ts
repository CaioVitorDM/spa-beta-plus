import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  private triggerFunctionSubject = new Subject<void>();

  triggerFunction$ = this.triggerFunctionSubject.asObservable();

  triggerFunction() {
    this.triggerFunctionSubject.next();
  }
}
