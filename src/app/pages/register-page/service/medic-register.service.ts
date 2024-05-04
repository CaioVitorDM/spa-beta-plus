import {environment} from '../../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {MedicUserForm, User} from '../../../models/User';
import {first, map, Observable} from 'rxjs';
import {toMedicUserEntity} from '../utils/medic-register.mapper';
import {ApiResponse} from '../../../models/ApiResponse';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MedicRegisterService {
  private readonly baseUrl = `${environment.apiPermissionUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  create(record: MedicUserForm): Observable<User> {
    const payload = toMedicUserEntity(record);

    return this.httpClient.post<ApiResponse<User>>(`${this.baseUrl}/register`, payload).pipe(
      first(),
      map(({data: user}: ApiResponse<User>) => user)
    );
  }
}
