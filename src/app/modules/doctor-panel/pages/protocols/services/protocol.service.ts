import {Injectable} from '@angular/core';
import {environment} from '../../../../../enviroments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {first, map, Observable} from 'rxjs';
import {ApiResponse, Direction, Page, ParamsPageProtocol} from '../../../../../models/ApiResponse';
import { Protocol } from 'src/app/models/Protocol';
import { Patient, User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root',
})
export class ProtocolService {
  private readonly baseUrl = environment.apiProtocolsUrl;

  constructor(private httpClient: HttpClient) {}

  create(record: Protocol): Observable<Protocol> {
    return this.httpClient.post<ApiResponse<Protocol>>(this.baseUrl, record).pipe(
      first(),
      map(({data: protocol}: ApiResponse<Protocol>) => protocol)
    );
  }

  getPatientsByDoctorId(doctorId: number): Observable<User[]> {
    return this.httpClient
      .get<ApiResponse<User[]>>(`${environment.apiPermissionUrl}/users/patients/${doctorId}`)
      .pipe(
        first(),
        map((response) => response.data)
      );
  }

  list({
    page = 0,
    size = 10,
    sort = 'createdAt',
    order = Direction.DESC,
    name,
    createdAt,
    doctorId,
  }: ParamsPageProtocol) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);

    const parameters = {
      name: name?.toString(),
      createdAt: createdAt?.toString(),
      doctorId: doctorId?.toString(),
    };

    Object.keys(parameters).forEach((key) => {
      const value = parameters[key as keyof typeof parameters];
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient
    .get<ApiResponse<Page<Protocol[]>>>(this.baseUrl + '/find-protocols', {params})
    .pipe(
      first(),
      map(({data}) => data)
    );
  }

}
