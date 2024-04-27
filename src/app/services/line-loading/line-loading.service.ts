/**
 * @description
 * Service managing the loading state for a line loader component.
 *
 * This service provides methods to show and hide the loading state, and exposes an observable `isLoading$`
 * that components can subscribe to for real-time updates on the loading status.
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LineLoadingService {
  /**
   * @description
   * BehaviorSubject representing the loading state.
   * It emits `true` when the loading state is active, and `false` when it is inactive.
   */
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * @description
   * Observable that components can subscribe to for real-time updates on the loading status.
   */
  isLoading$ = this.isLoadingSubject.asObservable();

  /**
   * @description
   * Method to show the loading state.
   * Invoking this method sets the loading state to active, and components subscribed to `isLoading$` will receive updates.
   */
  show() {
    this.isLoadingSubject.next(true);
  }

  /**
   * @description
   * Method to hide the loading state.
   * Invoking this method sets the loading state to inactive, and components subscribed to `isLoading$` will receive updates.
   */
  hide() {
    this.isLoadingSubject.next(false);
  }
}
