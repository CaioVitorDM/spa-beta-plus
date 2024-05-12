import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        swal.fire({
          title: 'Não autorizado!',
          text: 'Você não possui permissões suficientes!',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (error.status === 500) {
        swal.fire({
          title: 'Erro interno!',
          text: 'Tivemos algum erro interno no sistema!',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
      }
      return throwError(() => error);
    })
  );
};
