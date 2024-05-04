import {CanActivateFn} from '@angular/router';

export const noAuthGuard: CanActivateFn = (_route, _state) => {
  return true;
};
