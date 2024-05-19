import {Injectable} from '@angular/core';
import {environment} from '../../../../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {first, map, Observable} from 'rxjs';
import {ApiResponse} from '../../../../../models/ApiResponse';
import { Protocol } from 'src/app/models/Protocol';

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
}
