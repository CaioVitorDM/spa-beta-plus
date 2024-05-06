import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ApiResponse} from '../../models/ApiResponse';

export interface FileResponse {
  id: number;
  name: string;
  description?: string;
}

export type UrlImageType = string | ArrayBuffer | null;

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /**
   * The base URL for the password file API.
   */
  readonly baseUrl = `${environment.apiFilesUrl}`;

  clearImages = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  uploadImage(file: File, description?: string): Observable<ApiResponse<FileResponse>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    return this.http.post<ApiResponse<FileResponse>>(`${this.baseUrl}/upload`, formData);
  }

  downloadImage(id: number): Observable<File> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get(url, {observe: 'response', responseType: 'blob'}).pipe(
      map((response) => {
        if (response.body === null) {
          throw new Error('O corpo da resposta é null');
        }

        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        const filename = matches && matches[1] ? matches[1] : 'fallbackName.jpg';

        return new File([response.body], filename, {type: response.body.type});
      })
    );
  }

  /**
   * Reads a File object and returns a Promise that resolves with a data URL, an ArrayBuffer, or null.
   * Uses a FileReader to read the file as a data URL.
   *
   * @param {File} file - The file to read.
   * @returns {Promise<UrlImageType>} - A Promise that resolves with the file's data URL, an ArrayBuffer, or null.
   */
  readFileAsDataURL(file: File): Promise<UrlImageType> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as UrlImageType);
      };
      reader.readAsDataURL(file);
    });
  }

  triggerClearUploadImagesComponent() {
    this.clearImages.emit();
  }
}
