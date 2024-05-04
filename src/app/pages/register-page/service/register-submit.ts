import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RegisterSubmit {
  private submitSubject = new Subject<void>();
  submitObservable = this.submitSubject.asObservable();

  triggerSubmit() {
    this.submitSubject.next();
  }
}
