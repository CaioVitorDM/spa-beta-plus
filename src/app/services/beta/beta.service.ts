import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Beta } from 'src/app/models/Beta';

@Injectable({
  providedIn: 'root'
})
export class BetaService {
  private readonly baseUrl = 'api/beta';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Beta[]> {
    return this.httpClient.get<ApiResponse<Beta[]>>(this.baseUrl).pipe(
      first(),
      map(({ data }: ApiResponse<Beta[]>) => data)
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
