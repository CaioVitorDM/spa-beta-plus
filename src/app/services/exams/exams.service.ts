import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/app/enviroments/environment';
import {ApiResponse, Direction, Page, ParamsPageExams} from 'src/app/models/ApiResponse';
import {Exams} from 'src/app/models/Exams';
import {ExamsModule} from 'src/app/modules/pacient-panel/pages/exams/exams.module';
import {Observable, first, map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  private readonly baseUrl = environment.apiBetaUrl + '/v1/exams';

  constructor(private httpClient: HttpClient) {}

  create(record: Exams): Observable<Exams> {
    return this.httpClient.post<ApiResponse<Exams>>(this.baseUrl + '/save', record).pipe(
      first(),
      map(({data: exam}: ApiResponse<Exams>) => exam)
    );
  }

  update(id: number, record: Exams): Observable<Exams> {
    console.log(' exam que chegou no update:');
    console.log(record);

    return this.httpClient.put<ApiResponse<Exams>>(this.baseUrl + '/edit-exams/'+id, record).pipe(
      first(),
      map(({data: exam}: ApiResponse<Exams>) => exam)
    );
  }

  list({
    page = 0,
    size = 10,
    sort = 'examDate',
    order = Direction.DESC,
    patientId,
    name,
    fileId,
    examDate,
    examType,
    doctorId,
    id,
  }: ParamsPageExams) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);

    const parameters = {
      name: name?.toString(),
      patientId: patientId?.toString(),
      examDate: examDate?.toString(),
      examType: examType?.toString(),
      fileId: fileId?.toString(),
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
      .get<ApiResponse<Page<Exams[]>>>(this.baseUrl + '/find-exams', {params})
      .pipe(
        first(),
        map(({data}) => data)
      );
  }

  getOne(id: number): Observable<Exams> {
    return this.httpClient.get<ApiResponse<Exams>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({data: user}: ApiResponse<Exams>) => user)
    );
  }

  delete(id: number): Observable<Omit<ApiResponse<Exams>, 'data'>> {
    console.log('entrou delete service');
    return this.httpClient
      .delete<Omit<ApiResponse<Exams>, 'data'>>(`${this.baseUrl}/${id}`)
      .pipe(first());
  }
}
