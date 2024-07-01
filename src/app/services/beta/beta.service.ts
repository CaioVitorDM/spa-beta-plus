import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, first} from 'rxjs/operators';
import {ApiResponse, Direction, ParamsPageBeta} from 'src/app/models/ApiResponse';
import {Beta} from 'src/app/models/Beta';
import {Page} from 'src/app/models/ApiResponse';
import {environment} from 'src/app/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class BetaService {
  private readonly baseUrl = environment.apiBetaUrl + '/v1/beta';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Page<Beta[]>> {
    return this.httpClient.get<ApiResponse<Page<Beta[]>>>(this.baseUrl).pipe(
      first(),
      map(({data}: ApiResponse<Page<Beta[]>>) => data)
    );
  }

  getOne(id: number): Observable<Beta> {
    return this.httpClient.get<ApiResponse<Beta>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({data: user}: ApiResponse<Beta>) => user)
    );
  }

  create(record: Beta): Observable<Beta> {
    return this.httpClient.post<ApiResponse<Beta>>(this.baseUrl + '/save', record).pipe(
      first(),
      map(({data: beta}: ApiResponse<Beta>) => beta)
    );
  }

  delete(id: number): Observable<Omit<ApiResponse<Beta>, 'data'>> {
    return this.httpClient
      .delete<Omit<ApiResponse<Beta>, 'data'>>(`${this.baseUrl}/${id}`)
      .pipe(first());
  }

  update(id: number, record: Beta): Observable<Beta> {
    return this.httpClient.put<ApiResponse<Beta>>(this.baseUrl + '/edit-beta/' + id, record).pipe(
      first(),
      map(({data: beta}: ApiResponse<Beta>) => beta)
    );
  }

  list({
    page = 0,
    size = 10,
    sort = 'betaDate',
    order = Direction.DESC,
    patientId,
    betaDate,
    betaValue,
    doctorId,
    id,
  }: ParamsPageBeta) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);

    const parameters = {
      patientId: patientId?.toString(),
      betaDate: betaDate?.toString(),
      betaValue: betaValue?.toString(),
      doctorId: doctorId?.toString(),
      id: id?.toString(),
    };

    Object.keys(parameters).forEach((key) => {
      const value = parameters[key as keyof typeof parameters];
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient
      .get<ApiResponse<Page<Beta[]>>>(this.baseUrl + '/find-betas', {params})
      .pipe(
        first(),
        map(({data}) => data)
      );
  }  
}
