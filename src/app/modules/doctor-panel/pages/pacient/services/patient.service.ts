import {Injectable} from '@angular/core';
import {environment} from '../../../../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {MedicUserForm, PatientUserForm, User} from '../../../../../models/User';
import {first, map, Observable} from 'rxjs';
import {toMedicUserEntity} from '../../../../../pages/register-page/utils/medic-register.mapper';
import {ApiResponse} from '../../../../../models/ApiResponse';
import {toPatientUserEntity} from '../components/patient-form/utils/patient.mapper';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly baseUrl = `${environment.apiPermissionUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  create(record: PatientUserForm): Observable<User> {
    const payload = toPatientUserEntity(record);

    return this.httpClient.post<ApiResponse<User>>(`${this.baseUrl}/create`, payload).pipe(
      first(),
      map(({data: user}: ApiResponse<User>) => user)
    );
  }
}
