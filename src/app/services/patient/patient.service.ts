import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, map } from 'rxjs';
import { environment } from 'src/app/enviroments/environment';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Patient, User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly apiUrlPatients = `${environment.apiPermissionUrl}/patients`;

  constructor(
    private httpClient: HttpClient,
  ) {

  }

  getPatientsByDoctor(params: { doctorId: number, login?: string, name?: string }): Observable<User[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.httpClient.get<ApiResponse<User[]>>(`${environment.apiPermissionUrl}/users/patients/doctor`, { params: httpParams })
      .pipe(
        first(),
        map(response => response.data)  
      );
  }

  getPatientDetails(id: number): Observable<ApiResponse<Patient>> {
    return this.httpClient.get<ApiResponse<Patient>>(this.apiUrlPatients + "/" + id);
  }
}
