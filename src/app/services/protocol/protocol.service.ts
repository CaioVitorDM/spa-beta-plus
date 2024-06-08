import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {first, map, Observable} from 'rxjs';
import { Protocol } from 'src/app/models/Protocol';
import { Patient, User } from 'src/app/models/User';
import { environment } from 'src/app/enviroments/environment';
import { ApiResponse, Direction, Page, ParamsPageProtocol } from 'src/app/models/ApiResponse';
@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  private readonly baseUrl = environment.apiProtocolsUrl + '/v1/protocols';

  constructor(private httpClient: HttpClient) {}

  create(record: Protocol): Observable<Protocol> {
    return this.httpClient.post<ApiResponse<Protocol>>(this.baseUrl, record).pipe(
      first(),
      map(({data: protocol}: ApiResponse<Protocol>) => protocol)
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

  getOne(id: number): Observable<Protocol> {
    return this.httpClient.get<ApiResponse<Protocol>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({data: protocol}: ApiResponse<Protocol>) => protocol)
    );
  }

  delete(id: number): Observable<Omit<ApiResponse<Protocol>, 'data'>> {
    return this.httpClient
      .delete<Omit<ApiResponse<Protocol>, 'data'>>(`${this.baseUrl}/${id}`)
      .pipe(first());
  }

}


