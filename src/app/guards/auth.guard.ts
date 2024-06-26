import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthService} from 'src/app/services/auth/auth.service';
import swal from 'sweetalert2';

/**
 * Custom authentication guard function for route protection based on user roles.
 * @param route - The activated route snapshot.
 * @param _state - The router state.
 * @returns A boolean indicating whether the user is allowed to access the route.
 */
export const authGuard: CanActivateFn = (route, _state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];

  const userRole = authService.role;

  if (expectedRoles && expectedRoles.some((role) => role === userRole)) {
    return true;
  } else {
    swal
      .fire({
        icon: 'error',
        title: 'Unathorized!',
        text: 'Você não tem permissão para acessar essa página',
        timer: 3000,
        showConfirmButton: false,
      })
      .then(() => router.navigate(['/login-page']));
    return false;
  }
};
