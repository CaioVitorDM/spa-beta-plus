/**
 * @description
 * Service for managing the menu toggle functionality.
 *
 * This service provides methods for announcing and subscribing to menu toggle events using Observables.
 */

import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuToggleService {
  /**
   * Observable used to announce menu toggle events.
   */
  public toggleAnnounced$: Subject<void> = new Subject<void>();

  /**
   * Announces a menu toggle event.
   */
  public announceToggle(): void {
    this.toggleAnnounced$.next();
  }
}
