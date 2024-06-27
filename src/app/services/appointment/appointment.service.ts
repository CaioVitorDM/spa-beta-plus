import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, map } from 'rxjs';
import { environment } from 'src/app/enviroments/environment';
import { ApiResponse, Direction, Page, ParamsPageAppointment, ParamsPagePatient } from 'src/app/models/ApiResponse';
import { Appointment } from 'src/app/models/Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly baseUrl = environment.apiProtocolsUrl + '/v1/appointments';

  constructor(private httpClient: HttpClient) {}

  create(record: Appointment): Observable<Appointment> {
    return this.httpClient.post<ApiResponse<Appointment>>(this.baseUrl, record).pipe(
      first(),
      map(({data: appointment}: ApiResponse<Appointment>) => appointment)
    );
  }

  list({
    page = 0,
    size = 10,
    sort = 'appointmentDate',
    order = Direction.DESC,
    description,
    patientId,
    doctorId,
    local,
    appointmentDate,
  }: ParamsPageAppointment) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);

    const parameters = {
      description: description?.toString(),
      patientId: patientId?.toString(),
      local: local?.toString(),
      appointmentDate: appointmentDate?.toString(),
    };

    Object.keys(parameters).forEach((key) => {
      const value = parameters[key as keyof typeof parameters];
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient
    .get<ApiResponse<Page<Appointment []>>>(this.baseUrl + '/find-appointments', {params})
    .pipe(
      first(),
      map(({data}) => data)
    );
  }

  getOne(id: number): Observable<Appointment> {
    return this.httpClient.get<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`).pipe(
      first(),
      map(({data: user}: ApiResponse<Appointment>) => user)
    );
  }

  
  delete(id: number): Observable<Omit<ApiResponse<Appointment>, 'data'>> {
    return this.httpClient
      .delete<Omit<ApiResponse<Appointment>, 'data'>>(`${this.baseUrl}/${id}`)
      .pipe(first());
  }

  edit(record: Appointment): Observable<Appointment> {
    return this.httpClient.put<ApiResponse<Appointment>>(`${this.baseUrl}/${record.id}`, record).pipe(
      first(),
      map(({data: appointment}: ApiResponse<Appointment>) => appointment)
    );
  }

  
}
