import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private apiUrl = '/api'; // URL base
  constructor(private http: HttpClient) { }

  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admins`);
  }

  login(id: number, username: string, contra: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admins/login`, { id, username, contra });
  }
}