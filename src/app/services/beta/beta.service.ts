import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Beta } from 'src/app/models/Beta';
import { Page } from 'src/app/models/ApiResponse';
import { environment } from 'src/app/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class BetaService {
  private readonly baseUrl = environment.apiBetaUrl + '/v1/beta';


  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Page<Beta[]>> {
    return this.httpClient.get<ApiResponse<Page<Beta[]>>>(this.baseUrl).pipe(
      first(),
      map(({ data }: ApiResponse<Page<Beta[]>>) => data)
    );
  }

  getOne(id: number): Observable<Beta> {
    return this.httpClient.get<ApiResponse<Beta>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({ data }: ApiResponse<Beta>) => data)
    );
  }

  create(beta: Beta): Observable<Beta> {
    return this.httpClient.post<ApiResponse<Beta>>(this.baseUrl, beta).pipe(
      first(),
      map(({ data }: ApiResponse<Beta>) => data)
    );
  }

  // create(record: Beta): Observable<Beta> {
  //   return this.httpClient.post<ApiResponse<Beta>>(this.baseUrl, record).pipe(
  //     first(),
  //     map(({data: appointment}: ApiResponse<Beta>) => appointment)
  //   );
  // }

  // list({
  //   page = 0,
  //   size = 10,
  //   sort = 'examDate',
  //   // order = Direction.DESC,
  //   patientId,
  //       name,
  //       fileId,
  //       examDate,
  //       examType,
  //       doctorId,
  //       id,
  // }: ParamsPageExams) {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('size', size.toString())
  //     .set('sort', `${sort},${order}`);

  //   const parameters = {
  //     name: name?.toString(),
  //     patientId: patientId?.toString(),
  //     examDate: examDate?.toString(),
  //     examType: examType?.toString(),
  //     fileId: fileId?.toString(),
  //     doctorId: doctorId?.toString(),
  //     id: id?.toString(),
  //   };

  //   Object.keys(parameters).forEach((key) => {
  //     const value = parameters[key as keyof typeof parameters];
  //     if (value !== null && value !== undefined) {
  //       params = params.set(key, value);
  //     }
  //   });

  //   return this.httpClient
  //   .get<ApiResponse<Page<Exams []>>>(this.baseUrl + '/find-exams', {params})
  //   .pipe(
  //     first(),
  //     map(({data}) => data)
  //   );
  // }

  update(id: number, beta: Beta): Observable<Beta> {
    return this.httpClient.put<ApiResponse<Beta>>(`${this.baseUrl}/${id}`, beta).pipe(
      first(),
      map(({ data }: ApiResponse<Beta>) => data)
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(first());
  }
}
