import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/enviroments/environment';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Patient } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly apiUrlPatients = `${environment.apiPermissionUrl}/patients`;

  constructor(
    private httpClient: HttpClient,
  ) {

  }

  getPatientDetails(id: number): Observable<ApiResponse<Patient>> {
    return this.httpClient.get<ApiResponse<Patient>>(this.apiUrlPatients + "/" + id);
  }
}
