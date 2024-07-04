import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/app/enviroments/environment';
import {ApiResponse, Direction, Page, ParamsPageExams} from 'src/app/models/ApiResponse';
import {Exams, ExamsList} from 'src/app/models/Exams';
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

  listExams(
    page: number,
    size: number,
    sort: keyof ExamsList,
    order: Direction,
    name: string | null,
    examDate: string | null,
    examType: string | null,
    patientId: number | null
  ): Observable<Page<ExamsList>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('order', order);

    if (name) params = params.set('name', name);
    if (examDate) params = params.set('examDate', examDate);
    if (examType) params = params.set('examType', examType);
    if (patientId) params = params.set('patientId', patientId);

    return this.httpClient.get<Page<ExamsList>>(this.baseUrl, { params });
  }

  deleteExam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
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
