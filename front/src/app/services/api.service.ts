import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {
  protected baseUrl = 'http://localhost:3000/api'; //change with env in production

  constructor(protected http: HttpClient) {}

  protected get<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { headers });
  }

  protected post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body, { headers });
  }

  protected put<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body, { headers });
  }

  protected delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, { headers });
  }
}

