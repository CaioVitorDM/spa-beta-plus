import {Injectable} from '@angular/core';
import {environment} from '../../../../../enviroments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MedicUserForm, PatientUserForm, User, PatientList} from '../../../../../models/User';
import {first, map, Observable} from 'rxjs';
import {toMedicUserEntity} from '../../../../../pages/register-page/utils/medic-register.mapper';
import {ApiResponse, Direction, Page, ParamsPagePatient} from '../../../../../models/ApiResponse';
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

  edit(record: PatientUserForm): Observable<User> {
    const payload = toPatientUserEntity(record);

    return this.httpClient.put<ApiResponse<User>>(`${this.baseUrl}/edit-patient`, payload).pipe(
      first(),
      map(({data: user}: ApiResponse<User>) => user)
    );
  }

  list({
    page = 0,
    size = 10,
    sort = 'createdAt',
    order = Direction.DESC,
    name,
    email,
    phoneNumber,
    doctorId,
  }: ParamsPagePatient) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);

    const parameters = {
      name: name?.toString(),
      email: email?.toString(),
      phoneNumber: phoneNumber?.toString(),
      doctorId: doctorId?.toString(),
    };

    Object.keys(parameters).forEach((key) => {
      const value = parameters[key as keyof typeof parameters];
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient
      .get<ApiResponse<Page<User[]>>>(this.baseUrl + '/find-patients', {params})
      .pipe(
        first(),
        map(({data}) => data)
      );
  }

  getOne(id: number): Observable<User> {
    return this.httpClient.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({data: user}: ApiResponse<User>) => user)
    );
  }

  delete(id: number): Observable<Omit<ApiResponse<User>, 'data'>> {
    return this.httpClient
      .delete<Omit<ApiResponse<User>, 'data'>>(`${this.baseUrl}/${id}`)
      .pipe(first());
  }
}
