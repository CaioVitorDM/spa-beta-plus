import {Injectable} from '@angular/core';
import {Role} from '../../models/Role';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  /**
   * This service provides route information based on the user's role.
   * @param userRole - The role of the user (e.g., Role.ADMIN or Role.SELLER).
   * @returns A string representing the route to navigate to based on the user's role.
   */
  getRouteBasedOnUserRole(userRole: Role): string {
    if (userRole === Role.MEDIC) {
      return '/doctor-panel/dashboard';
    } else if (userRole === Role.PATIENT) {
      return '/patient-panel/dashboard';
    } else {
      return '/login-page';
    }
  }
}
